import * as psl from "psl";

// $ExpectType string | null
psl.get("example.com");

// $ExpectType boolean
psl.isValid("example.com");
