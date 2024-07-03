# it depends on ...

is a typescript library wich helps *unit testing* your architecture.

It guards
* layer
* and software

 dependencies, by integrating a contract into your unit tests. 

## it is driven by ...
the functions ``directoryDependsOn`` (positive list) and ``directoryDoesNotDependOn`` (negative list) which scan  ``import`` statements of typescript files (``.ts``) recursively to find forbidden specifiers.

 ### Example DDD 

Any domain is self containing, but may depend from the common domain

````typescript
assert(
    await directoryDependsOn(
        "./test/ddd/*",
        "./test/ddd/common"
    ),
    "domain is not self containing"
);

````
Any application layer is allowed to access almost everything in its own domain and the common domain. 
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
Any application layer and any model do not depend on any external software dependency.

````typescript 
 assert(
    await directoryDoesNotDependOn(
        "./test/ddd/*/{application,domain/model}"
    )
);
````

Check https://github.com/pamoller/it-depends-on/tree/main/test for a detailed view.

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
import * as layer from 'jsr:@pamoller/it-depends-on@^0.1.4/layer';
import * as software from 'jsr:@pamoller/it-depends-on@^0.1.4/software';

describe("test layer policy", async () => {
    it("common is self containing", async () => {
        assert(layer.directoryDoesNotDependOn("./common"));
    });

    it("rules and test are client of common", async () => {
        assert(layer.directoryDependsOn("./rules", "./common"));
        assert(layer.directoryDependsOn("./test", "./common"));
    });
});````
