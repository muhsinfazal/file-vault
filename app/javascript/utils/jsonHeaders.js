export const jsonHeaders = () => ({
  "Content-Type": "application/json",
  "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content
});
