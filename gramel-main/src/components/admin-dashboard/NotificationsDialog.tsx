"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { useAuthContext } from "@/context/AuthContext";
import { ArrowLeft, Trash2, Bell, XIcon, Loader2, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import DOMPurify from "dompurify";
import {
  deleteNotificationAction,
  getNotificationsAction,
  markNotificationAsReadAction,
} from "@/server-actions/notifications";

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMins = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMins < 1) return "Just now";
  if (diffInMins < 60) return `${diffInMins}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return date.toLocaleDateString();
};

interface NotificationsDialogProps {
  open: boolean;
  onClose: () => void;
}

export function NotificationsDialog({
  open,
  onClose,
}: NotificationsDialogProps) {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();
  const LIMIT = 50;

  // Fetch notifications
  const {
    data,
    isLoading,
    error: notificationsError,
    hasNextPage,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["notifications", user?.id],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => getNotificationsAction(pageParam, LIMIT),
    getNextPageParam: (lastPage, allPages) => {
      return (lastPage?.length ?? 0) < LIMIT
        ? undefined
        : allPages.flatMap((page) => page).length;
    },
    maxPages: 10,
    enabled: open && !!user,
  });

  const notifications = data?.pages.flat(1) || [];
  type Notification = (typeof notifications)[number];

  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);

  // Mark notification as read
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: number) => {
      await markNotificationAsReadAction(notificationId);
    },
    onSuccess: () => {
      queryClient.setQueriesData(
        { queryKey: ["notifications"] },
        (oldNotifications: typeof data) => {
          if (!oldNotifications) return oldNotifications;

          return {
            ...oldNotifications,
            pages: oldNotifications.pages.map((page) =>
              page.map((n) =>
                n.id === selectedNotification?.id
                  ? { ...n, read_at: new Date().toISOString() }
                  : n,
              ),
            ),
          };
        },
      );

      queryClient.setQueriesData(
        { queryKey: ["notificationsCount"] },
        (oldCount: number) => (oldCount ? Math.max(oldCount - 1, 0) : 0),
      );
    },
  });

  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification);
    if (!notification.read_at) {
      markAsReadMutation.mutate(notification.id);
    }
  };

  // Delete notification
  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId: number) => {
      await deleteNotificationAction(notificationId);
    },
    onSuccess: () => {
      let deletedNotificationIndex: number | null = null;
      let deletedNotificationPageIndex: number | null = null;
      let newNotificationsCount = 0;
      let nextNotificationToShow: Notification | null = null;

      queryClient.setQueriesData(
        { queryKey: ["notifications"] },
        (oldData: typeof data | undefined) => {
          if (!oldData) return oldData;

          const newPages = oldData.pages.map((page, pIndex) =>
            page.filter((n, i) => {
              if (n.id === selectedNotification?.id) {
                deletedNotificationIndex = i;
                deletedNotificationPageIndex = pIndex;
                return false;
              }
              newNotificationsCount++;
              return true;
            }),
          );

          // --- pick the next notification to show ---
          if (
            deletedNotificationPageIndex !== null &&
            deletedNotificationIndex !== null
          ) {
            const currentPage = newPages[deletedNotificationPageIndex];

            // Try next notification
            nextNotificationToShow =
              newNotificationsCount === 0
                ? null
                : (currentPage?.[deletedNotificationIndex] ??
                  // If deleted was last item, try next page’s first notification if available
                  newPages[deletedNotificationPageIndex + 1]?.[0] ??
                  // Try previous notification before deleted item
                  currentPage?.[deletedNotificationIndex - 1] ??
                  // Or previous page’s last notification
                  newPages[deletedNotificationPageIndex - 1]?.slice(-1)[0] ??
                  null);
          }

          return { ...oldData, pages: newPages };
        },
      );

      // Update the selected notification after cache update
      setSelectedNotification(nextNotificationToShow);

      // If all notifications are gone, fetch next page if available
      if (newNotificationsCount === 0 && hasNextPage) {
        setTimeout(fetchNextPage, 200);
      }
      if (nextNotificationToShow) {
        const notificationToShow = nextNotificationToShow;
        setTimeout(() => handleNotificationClick(notificationToShow), 100);
      }

      toast.success("Notification deleted");
    },
    onError: () => {
      toast.error("Failed to delete notification");
    },
  });

  const handleDelete = () => {
    if (selectedNotification) {
      deleteNotificationMutation.mutate(selectedNotification.id);
    }
  };

  if (!user) return null;

  return (
    <AlertDialog
      open={open}
      onOpenChange={(open) => {
        setSelectedNotification(null);
        onClose();
      }}
    >
      <AlertDialogOverlay className="bg-transparent backdrop-blur-xs" />
      <AlertDialogContent className="grid h-[80vh] max-h-[37.5rem] grid-rows-[auto_1fr] gap-0 overflow-hidden p-0 md:max-w-[calc(100%-4rem)] lg:max-w-4xl">
        {/* Custom close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-20 flex size-10 cursor-pointer items-center justify-center rounded-sm bg-red-50 text-red-500 duration-300 hover:bg-red-100"
        >
          <XIcon className="size-5" />
        </button>

        <AlertDialogHeader className="border-b px-6 py-4">
          <AlertDialogTitle className="flex items-center gap-2">
            <Bell className="size-5" />
            Notifications
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div className="flex overflow-hidden">
          {/* Notifications List Panel */}
          <div
            className={cn(
              "size-full border-r transition-transform duration-300 ease-in-out md:w-80",
              selectedNotification
                ? "-translate-x-full md:translate-x-0"
                : "translate-x-0",
            )}
          >
            {isLoading ? (
              <div className="flex h-full items-center justify-center text-gray-400">
                <div className="flex flex-wrap items-center gap-2 p-4 text-center text-sm text-gray-500">
                  <Loader2 className="size-5 animate-spin" /> Loading
                  notifications...
                </div>
              </div>
            ) : notificationsError ? (
              <div className="flex h-full items-center justify-center text-gray-400">
                <div className="rounded-sm bg-red-50 p-4 text-center">
                  <Info className="mx-auto mb-3 size-12 text-red-500" />
                  <p className="text-sm text-red-500">
                    Failed to load notifications
                  </p>
                </div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex h-full items-center justify-center text-gray-400">
                <div className="text-center">
                  <Bell className="mx-auto mb-3 size-12 text-gray-300" />
                  <p className="text-sm text-gray-500">No notifications yet</p>
                </div>
              </div>
            ) : (
              <ScrollArea className="size-full">
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <button
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={cn(
                        "w-full p-4 text-left transition-colors hover:bg-gray-100 focus:outline-primary-300",
                        selectedNotification?.id === notification.id &&
                          "bg-gray-200",
                        !notification.read_at && "bg-light-gray-100",
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h3
                          className={cn(
                            "line-clamp-2 text-sm font-semibold",
                            !notification.read_at
                              ? "font-bold text-gray-900"
                              : "text-gray-600",
                          )}
                        >
                          {notification.title}
                        </h3>
                        {!notification.read_at && (
                          <div className="mt-1.5 size-2 flex-shrink-0 rounded-full bg-blue-600" />
                        )}
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        {formatTime(notification.created_at)}
                      </p>
                    </button>
                  ))}
                </div>
                {hasNextPage && (
                  <div className="border-t p-3">
                    <Button
                      size="sm"
                      disabled={isFetching || isFetchingNextPage}
                      onClick={() => fetchNextPage()}
                      className="w-full cursor-pointer hover:bg-primary-300"
                    >
                      {isFetchingNextPage ? (
                        <Loader2 className="animate-spin text-white" />
                      ) : (
                        "Load More"
                      )}
                    </Button>
                  </div>
                )}
              </ScrollArea>
            )}
          </div>

          {/* Notification Details Panel */}
          <div
            className={cn(
              "absolute inset-0 bg-white transition-transform duration-300 ease-in-out md:static md:flex-1",
              selectedNotification
                ? "translate-x-0"
                : "translate-x-full md:translate-x-0",
            )}
          >
            {selectedNotification ? (
              <>
                {/* Mobile back button */}
                <div className="flex items-center gap-2 border-b px-4 py-3 md:hidden">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedNotification(null)}
                    className="gap-2"
                  >
                    <ArrowLeft className="size-4" />
                    Back
                  </Button>
                </div>

                <ScrollArea className="size-full">
                  <div className="p-6">
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <h2 className="text-xl font-semibold text-gray-900">
                        {selectedNotification.title}
                      </h2>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleDelete}
                        disabled={deleteNotificationMutation.isPending}
                        className="flex-shrink-0 cursor-pointer text-red-600 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-100"
                      >
                        {deleteNotificationMutation.isPending ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Trash2 className="size-4" />
                        )}
                      </Button>
                    </div>
                    <p className="mb-6 text-sm text-gray-500">
                      {formatTime(selectedNotification.created_at)}
                    </p>
                    <div
                      className="prose prose-sm max-w-none text-gray-700 [&_ul>li]:marker:text-primary-300"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(
                          selectedNotification.content,
                        ),
                      }}
                    />
                  </div>
                </ScrollArea>
              </>
            ) : (
              <div className="hidden h-full items-center justify-center text-gray-400 md:flex">
                <div className="text-center">
                  <Bell className="mx-auto mb-3 size-12 text-gray-300" />
                  <p className="text-sm text-gray-500">
                    Select a notification to view
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
