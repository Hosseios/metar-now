
// Allow TypeScript to import CSV files as text modules.
declare module "*.csv" {
  const value: string;
  export default value;
}
