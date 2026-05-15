import { useParams }    from "react-router-dom";
import UserList          from "./UserList";           // ← same folder
import AccessRequests    from "./AccessRequests";     // ← same folder
// import { RolesPermissions, PendingInvitations } from "./Placeholdertabs";
import ProfileSettings   from "../profileSettings";  // ← 1 level up
import useToast          from "../../../hooks/useToast"; // ← 2 levels up
import { ToastContainer } from "../../../components/ui/Toast"; // ← 2 levels up

export default function PagesSettings() {
  const { tab } = useParams();
  const { toasts, showToast, removeToast } = useToast();

  const renderTab = () => {
    switch (tab) {
      case "user-list": return <UserList showToast={showToast} />;
      // case "roles-permissions": return <RolesPermissions />;
      // case "pending-invitations": return <PendingInvitations />;
      case "access-requests": return <AccessRequests showToast={showToast} />;
      case "profileSettings": return <ProfileSettings />; // ← match!
      default: return <UserList showToast={showToast} />;
    }
  };

  return (
    <div className="px-3 sm:px-5 md:px-8 py-4 sm:py-6 md:py-8 w-full">
      {renderTab()}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}