import {
  TSESTree,
  AST_NODE_TYPES,
} from '@typescript-eslint/experimental-utils';
import { createRule, hasConstructSuperClass } from '../utils';

export interface MethodSignaturParameter {
  name: string;
  type?: string;
}

export default createRule({
  name: 'props-struct-name',
  meta: {
    docs: {
      description: 'Ensure a uniform construct constructors signature',
      category: 'Best Practices',
      recommended: 'error',
    },
    messages: {
      propsStructNname: 'All constructs must have a props struct',
    },
    schema: [],
    type: 'problem',
  },
  defaultOptions: [],
  create(context) {
    const sourceCode = context.getSourceCode();

    let isConstruct = false;
    let className: string | undefined;

    const getIdentifier = (node: TSESTree.Parameter) =>
      node.type === AST_NODE_TYPES.AssignmentPattern ? node.left : node;

    return {
      'ClassDeclaration[superClass]'(node: TSESTree.ClassDeclaration): void {
        isConstruct = hasConstructSuperClass(node);
        className = node.id?.name;
      },
      'MethodDefinition[key.name = "constructor"]'(
        node: TSESTree.MethodDefinition,
      ): void {
        if (!isConstruct || node.value.params.length < 3) {
          return;
        }

        const identifier = getIdentifier(node.value.params[2]);

        const type = sourceCode.getLastToken(identifier)?.value;

        if (type !== `${className}Props`) {
          context.report({
            node: identifier,
            messageId: 'propsStructNname',
          });
        }
      },
    };
  },
});
