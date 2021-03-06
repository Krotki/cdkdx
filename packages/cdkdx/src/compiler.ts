import * as path from 'path';
import execa from 'execa';

import { TsConfig } from './ts-config';
import { ProjectInfo } from './project-info';

export interface CompilerProps {
  cwd: string;
  watch?: boolean;
  projectInfo: ProjectInfo;
}

export interface Compiler {
  compile: (props: CompilerProps) => Promise<void>;
}

export class JsiiCompiler implements Compiler {
  public async compile(props: CompilerProps): Promise<void> {
    const command = require.resolve('jsii/bin/jsii');

    const args = ['--project-references', '--silence-warnings=reserved-word'];

    if (props.watch) {
      args.push('-w');
    }

    await execa(command, args);
  }
}

export class TscCompiler implements Compiler {
  public async compile(props: CompilerProps): Promise<void> {
    const tsConfig = TsConfig.fromJsiiTemplate({
      outDir: './lib',
      include: props.projectInfo.typescriptIncludes,
      exclude: props.projectInfo.typescriptExcludes,
    });

    await tsConfig.writeJson(path.join(props.cwd, 'tsconfig.json'), {
      overwriteExisting: false,
    });

    const command = require.resolve('typescript/bin/tsc');
    const args = ['--build'];

    if (props?.watch) {
      args.push('-w');
    }

    await execa(command, args, {
      stdio: ['ignore', 'inherit', 'inherit'],
    });
  }
}
