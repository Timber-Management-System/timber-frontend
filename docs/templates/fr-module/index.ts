/**
 * TEMPLATE – public exports of an FR module.
 *
 * Copy this whole folder into your FR folder (see CONTRIBUTING.md › "Start a new FR"), then rename
 * "Example" to your feature name. The page in src/app imports ONLY from this file:
 *
 *   // src/app/(app)/site-tree/tree-approval/page.tsx
 *   import { TreeApprovalPage } from '@/modules/site-tree/fr-12-tree-approval';
 *   export default function Page() {
 *     return <TreeApprovalPage />;
 *   }
 */
export { ExamplePage } from './components/ExamplePage';
export type { ExampleItem } from './types/example.types';
