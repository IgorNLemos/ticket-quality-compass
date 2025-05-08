
// Forge entry point
export async function handler(event, context) {
  // This resolver function handles both the global page and issue panel requests
  // It returns basic information needed by the frontend
  return {
    // Return basic context information to the frontend
    title: 'Ticket Evaluation',
    data: {
      environmentType: context.environmentType,
      moduleKey: event.moduleKey,
      productContext: context.productContext
    }
  };
}
