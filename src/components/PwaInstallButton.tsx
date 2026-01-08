import { Download } from "lucide-react";
import { usePwaInstall } from "@/hooks/usePwaInstall";
import { toast } from "sonner";

const PwaInstallButton = () => {
  const { isInstallable, isInstalled, install } = usePwaInstall();

  const handleInstall = async () => {
    const success = await install();
    if (success) {
      toast.success("App installed successfully! You can now receive notifications.");
    }
  };

  if (isInstalled) {
    return (
      <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded">
        <Download size={18} />
        App Installed
      </div>
    );
  }

  if (!isInstallable) {
    return null;
  }

  return (
    <button
      onClick={handleInstall}
      className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
    >
      <Download size={18} />
      Install App
    </button>
  );
};

export default PwaInstallButton;
