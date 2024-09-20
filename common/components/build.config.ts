import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  clean: true,
  entries: ['index'],
  declaration: true,
  rollup: {
    emitCJS: true,
  },
});
