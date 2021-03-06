import rule from '../../src/rules/construct-ctor';
import { RuleTester } from '../rule-tester';

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('construct-ctor', rule, {
  valid: [
    {
      code: `
      class Test extends Construct {
          constructor(scope: Construct, id: string, props: TestProps) {}

          public foo():void {}
      }
      `,
    },
    {
      code: `
      class Test extends Construct {
          constructor(scope: Construct, id: string) {}
      }
      `,
    },
    {
      code: `
      class Test {
          constructor(foo: string) {}
      }
      `,
    },
    {
      code: `
      class Test extends Construct {
          constructor(scope: Construct, id: string, props: TestProps = {}) {}
      }
      `,
    },
  ],
  invalid: [
    {
      code: `
      class Test extends Construct {
          constructor(parent: Construct, id: string, props: TestProps) {}
      }
      `,
      errors: [
        {
          messageId: 'constructCtor',
        },
      ],
    },
    {
      code: `
      class Test extends cdk.Construct {
          constructor(parent: cdk.Construct, id: string, props: TestProps) {}
      }
      `,
      errors: [
        {
          messageId: 'constructCtor',
        },
      ],
    },
    {
      code: `
      class Test extends Construct {
          constructor(scope: Construct, idx: string, props: TestProps) {}
      }
      `,
      errors: [
        {
          messageId: 'constructCtor',
        },
      ],
    },
    {
      code: `
      class Test extends Construct {
          constructor() {}
      }
      `,
      errors: [
        {
          messageId: 'constructCtor',
        },
      ],
    },
  ],
});
