// Alias classnames as cn for auto-importing

declare module "classnames" {
  import { ClassNamesExport } from "classnames/types";
  const cn: ClassNamesExport;
  export default cn;
}
