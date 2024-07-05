[![JSR @pamoller/it-depends-on](https://jsr.io/badges/@pamoller/it-depends-on)](https://jsr.io/@pamoller/it-depends-on)
[![GitHub Actions CI](https://github.com/pamoller/it-depends-on/workflows/ci/badge.svg)](https://github.com/pamoller/it-depends-on/actions/workflows/ci.yml)
# it depends on ...

is a typescript library wich helps *unit testing* your architecture.

It guards
* layer
* and software

 dependencies, by checking the layers for compliance. 

## it is driven by ...

* positive lists (``directoryDependsOn``) and
* negative lists (``directoryDoesNotDependOn``)

of patterns which are compared to the imported specifiers of typescript files (``.ts``). Relative specifiers are handled by ``rules/layer.ts`` all other by ``rules/software.ts``.
 
 ## it may allow ... 

any domain being self containing, but may depend from the common domain
````typescript
assert(
    await directoryDependsOn(
        "./test/ddd/*",
        "./test/ddd/common"
    ),
    "domain is not self containing"
);
````

or any application layer to access almost everything in its own domain and the common domain. 
````typescript
assert(
    await directoryDependsOn(
        "./test/ddd/*/application",
        "./test/ddd/*/domain/model",
        "./test/ddd/*/infrastructure",
        "./test/ddd/common",
    ),
    "access forbidden"
);
````

or any application layer and any model to not depend on any external software dependency.
````typescript 
 assert(
    await directoryDoesNotDependOn(
        "./test/ddd/*/{application,domain/model}"
    )
);
````

Check the [test folder](https://github.com/pamoller/it-depends-on/tree/main/test) for a detailed view.

## Installation

### deno
````bash
$ deno add @pamoller/it-depends-on
````

### npm
````bash
$ npx jsr add @pamoller/it-depends-on 
````

## Usage

### Example deno

````typescript
import { describe, it } from "https://deno.land/std@0.196.0/testing/bdd.ts";
import { assert } from "https://deno.land/std@0.196.0/assert/mod.ts";
import * as layer from 'jsr:@pamoller/it-depends-on@^0.1.7/layer';
import * as software from 'jsr:@pamoller/it-depends-on@^0.1.7/software';

describe("test layer compliance", async () => {
    it("common depends only on itself,jsr and npm", async () => {
        assert(await layer.directoryDependsOn("./common"));
        assert(await software.directoryDependsOn("./common", "jsr:*", "npm:*"));
    });

    it("rules is an exclusive client of common", async () => {
        assert(await layer.directoryDependsOn("./rules", "./common"));
        assert(await software.directoryDoesNotDependOn("./rules"));
    });
});````
