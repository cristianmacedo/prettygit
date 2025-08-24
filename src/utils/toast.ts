const toastStyles = document.createElement("style");
toastStyles.textContent = `
  #prettygit-toast {
    position: fixed;
    bottom: 1rem;
    left: 1rem;
    display: flex;
    align-items: center;
    padding: 1rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    z-index: 9999;
    transition: all 200ms ease-in-out;
    transform: translateY(0);
    opacity: 1;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  }
  #prettygit-toast.fade-out {
    transform: translateY(1rem);
    opacity: 0;
  }
  #prettygit-toast.success { background-color: #059669; color: white; }
  #prettygit-toast.error { background-color: #DC2626; color: white; }
  #prettygit-toast.warning { background-color: #D97706; color: white; }
  #prettygit-toast .icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 2rem;
    height: 2rem;
    margin-right: 0.75rem;
    border-radius: 0.5rem;
  }
  #prettygit-toast .message {
    font-size: 0.875rem;
    font-weight: 500;
  }
  #prettygit-toast .close-button {
    margin-left: auto;
    margin-right: -0.375rem;
    margin-top: -0.375rem;
    margin-bottom: -0.375rem;
    border-radius: 0.5rem;
    padding: 0.375rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 2rem;
    width: 2rem;
    color: white;
    opacity: 0.8;
    transition: all 150ms;
  }
  #prettygit-toast .close-button:hover {
    background-color: rgba(255, 255, 255, 0.2);
    opacity: 1;
  }
  #prettygit-toast .close-button:focus {
    outline: 2px solid rgba(255, 255, 255, 0.5);
    outline-offset: 2px;
  }
`;
document.head.appendChild(toastStyles);

const icons = {
  success:
    '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/></svg>',
  error:
    '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/></svg>',
  warning:
    '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z"/></svg>',
};

export function showToast(
  type: "warning" | "error" | "success",
  content: string
) {
  const existingToast = document.getElementById("prettygit-toast");
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement("div");
  toast.id = "prettygit-toast";
  toast.className = type;

  const icon = document.createElement("div");
  icon.className = "icon";
  icon.innerHTML = icons[type];

  const message = document.createElement("div");
  message.className = "message";
  message.textContent = content;

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "close-button";
  closeButton.innerHTML =
    '<svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/></svg>';
  closeButton.onclick = () => toast.remove();

  toast.appendChild(icon);
  toast.appendChild(message);
  toast.appendChild(closeButton);

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("fade-out");
    setTimeout(() => toast.remove(), 200);
  }, 3000);
}
