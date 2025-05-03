
import { useEffect, useState, useCallback } from 'react';
import { useBeforeUnload, useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

/**
 * A hook that protects forms from accidental navigation when there are unsaved changes
 * @param isDirty Boolean indicating if the form has unsaved changes
 * @param navigateToPath Optional path to navigate to after confirmation
 */
export function useFormProtection(isDirty: boolean, navigateToPath?: string) {
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  // Add browser warning when closing tab/window
  useBeforeUnload(
    useCallback(
      (event) => {
        if (isDirty) {
          event.preventDefault();
          return (event.returnValue = 'You have unsaved changes. Are you sure you want to leave?');
        }
      },
      [isDirty]
    )
  );

  // Handle navigation attempts
  const handleNavigation = (path: string) => {
    if (isDirty) {
      setPendingNavigation(path);
      setShowDialog(true);
    } else {
      navigate(path);
    }
  };

  // Handle cancel button (stay on page)
  const handleCancel = () => {
    setShowDialog(false);
    setPendingNavigation(null);
  };

  // Handle confirm button (navigate away)
  const handleConfirm = () => {
    setShowDialog(false);
    if (pendingNavigation) {
      navigate(pendingNavigation);
    }
  };

  // If navigateToPath is provided, create navigateWithConfirmation function
  const navigateWithConfirmation = navigateToPath
    ? () => handleNavigation(navigateToPath)
    : undefined;

  return {
    navigateWithConfirmation,
    ProtectionDialog: () => (
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to leave?
              Your changes will be lost if you continue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    ),
  };
}
