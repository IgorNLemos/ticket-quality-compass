
// Definition for the Forge data that gets injected into the window object
interface ForgeData {
  data: {
    environmentType: string;
    moduleKey: string;
    productContext: any;
  };
}

// Add to the Window interface
interface Window {
  ForgeData?: ForgeData;
}
