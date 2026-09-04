import { ArchiveXIcon, Trash2Icon, XIcon } from 'lucide-react'
import type React from 'react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '~/components/ui/alert-dialog'
import { Button } from '~/components/ui/button'
import { ButtonGroup } from '~/components/ui/button-group'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/ui/tooltip'
import { useDisclosure } from '~/hooks/use-disclosure'

interface EntryControlsProps {
  isDirty: boolean
  isSubmitting: boolean
  entryId: number
  onCancel: () => void
  onDelete: () => void
}

export const EntryControls: React.FC<EntryControlsProps> = ({
  isDirty,
  isSubmitting,
  entryId,
  onCancel,
  onDelete,
}) => {
  const discardDialog = useDisclosure()

  return (
    <ButtonGroup>
      <>
        <Tooltip delayDuration={400}>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="secondary"
              size="icon-sm"
              disabled={isSubmitting}
              onClick={isDirty ? discardDialog.open : onCancel}
            >
              <ArchiveXIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Cancel</TooltipContent>
        </Tooltip>
        <AlertDialog
          open={discardDialog.opened}
          onOpenChange={discardDialog.toggle}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Discard changes?</AlertDialogTitle>
              <AlertDialogDescription>
                Any unsaved changes will be lost.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep editing</AlertDialogCancel>
              <AlertDialogAction onClick={onCancel}>
                Discard changes
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
      {entryId && (
        <AlertDialog>
          <Tooltip delayDuration={400}>
            <TooltipTrigger asChild>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon-sm"
                  disabled={isSubmitting}
                >
                  <Trash2Icon />
                </Button>
              </AlertDialogTrigger>
            </TooltipTrigger>
            <TooltipContent>Delete</TooltipContent>
          </Tooltip>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this entry?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={onDelete}>
                Delete entry
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </ButtonGroup>
  )
}
