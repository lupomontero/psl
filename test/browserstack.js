import http from 'http'
import browserstack from 'browserstack-local'
import webdriver from 'selenium-webdriver'
import handler from 'serve-handler'
import getCapabilities from 'browserslist-browserstack'

const { BROWSERSTACK_USER, BROWSERSTACK_KEY } = process.env

const BUILD = `browserstack-build-${Date.now()}`
const PORT = 3000
const url = `http://localhost:${PORT}/test/index.html`

const bsConfig = {
  project: 'psl',
  'browserstack.local': 'true',
  'browserstack.user': BROWSERSTACK_USER,
  'browserstack.key': BROWSERSTACK_KEY,
  build: BUILD,
  name: 'Mocha test suite in browser',
  'browserstack.debug': 'true',
  'browserstack.console': 'info',
  'browserstack.networkLogs': 'true'
}

const testBrowser = async (capabilities) => {
  const driver = new webdriver.Builder()
    .usingServer('http://hub-cloud.browserstack.com/wd/hub')
    .withCapabilities({
      ...bsConfig,
      ...capabilities,
      // Because NodeJS language binding requires browserName to be defined
      ...(capabilities.browser && {
        browserName: capabilities.browser
      })
    })
    .build()

  await driver.get(url)
  await driver.wait(webdriver.until.elementLocated(webdriver.By.id('results')))

  const results = await driver.executeScript(function () {
    return window.results
  })

  const setSessionStatusAction = `browserstack_executor: ${JSON.stringify({
    action: 'setSessionStatus',
    arguments: (
      results.failures
        ? {
          status: 'failed',
          reason: `${results.failures} tests failed`
        }
        : {
          status: 'passed',
          reason: `${results.total} tests passed`
        }
    )
  })}`

  await driver.executeScript(setSessionStatusAction)
  await driver.quit()

  return results
}

const main = () => new Promise(async (resolve, reject) => {
  try {
    const { createStream } = await import('porch')
    const server = http.createServer(handler).listen(PORT)
    const bsLocal = new browserstack.Local()
    const capabilities = await getCapabilities({
      username: BROWSERSTACK_USER,
      accessKey: BROWSERSTACK_KEY,
      browserslist: {
        queries: ['defaults']
      }
    })

    bsLocal.start({ key: BROWSERSTACK_KEY }, (err) => {
      if (err) {
        return reject(err)
      }

      let failures = 0

      createStream(capabilities.map(cap => () => testBrowser(cap)), 5, 0, false)
        .on('data', ({ result, idx }) => {
          failures += result.failures
          console.log(
            capabilities[idx].browser,
            capabilities[idx].browserVersion,
            capabilities[idx].os,
            capabilities[idx].os_version,
            result.failures
              ? `❌ ${result.failures}! tests failed`
              : `✔️ ${result.total} tests passed in ${result.stats.duration}ms`
          )
        })
        .on('end', () => {
          bsLocal.stop(() => {
            server.close(() => resolve(failures))
          })
        })
    })
  } catch (err) {
    reject(err)
  }
})

main()
  .then((failures) => {
    console.log(`\n${failures} failures in total`)
    process.exit(failures)
  })
  .catch((err) => {
    console.error(err)
    process.exit(-1)
  })
