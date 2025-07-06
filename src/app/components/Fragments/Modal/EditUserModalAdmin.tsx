"use client";

import { UserDetail } from "@/types/UserDetail";
import { useState, useEffect, useRef } from "react";
import Input from "../../Elements/Input";
import { toZonedTime, format } from "date-fns-tz";
import { X } from "lucide-react";
import { capitalizeName } from "@/utils/commonFunctions";
import Button from "../../Elements/Button";
import { useSession } from "next-auth/react";
import NotificationModal from "./NotificationModal";
import Select from "../../Elements/Select";

type Props = {
  show: boolean;
  user: UserDetail | null;
  onClose: () => void;
  onSave?: (user: UserDetail) => void;
};

export default function EditUserModal({ show, user, onClose, onSave }: Props) {
  const [edited, setEdited] = useState<UserDetail | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const [notif, setNotif] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error",
  });

  useEffect(() => {
    if (user) setEdited(user);
  }, [user]);

  // ✅ Tutup modal jika klik di luar modal box
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show, onClose]);
  const handleSubmitBillingDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!edited?.user_id || !edited.billing_date) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL_API}/api/users/update-by-admin`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          },
          body: JSON.stringify({
            user_id: edited.user_id,
            billing_date: edited.billing_date,
            is_subscribe: edited.is_subscribe,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        setNotif({
          show: true,
          message: data.message,
          type: "success",
        });
        setTimeout(() => {
          onClose(); // tutup modal setelah jeda
          onSave?.(edited); // update state parent
          setNotif({
            show: false,
            message: "",
            type: "success" as "success" | "error",
          });
        }, 1500); // jeda 1.5 detik
      } else {
        setNotif({
          show: true,
          message: "Gagal update: " + data.message,
          type: "error",
        });
        setTimeout(() => {
          setNotif({
            show: false,
            message: "",
            type: "success" as "success" | "error",
          });
        }, 1500);
      }
    } catch (error) {
      console.error("Error update billing date:", error);
      setNotif({
        show: true,
        message: "Terjadi kesalahan saat update.",
        type: "error",
      });
    }
  };

  if (!show || !edited) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/50 bg-opacity-40 backdrop-blur-sm z-50 flex items-center justify-center ">
      <div
        ref={modalRef}
        className="relative bg-gray-800 p-6 rounded-xl w-full max-w-md mx-3"
      >
        {/* ❌ Tombol close kanan atas */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 text-white hover:text-red-400"
        >
          <X size={25} />
        </button>

        <h2 className="flex gap-1.5 text-lg font-medium mb-4 text-white">
          Edit Data{" "}
          <p className="font-semibold">{capitalizeName(user?.name ?? "")}</p>
        </h2>
        <hr />
        <br />
        <div className="space-y-4">
          <form onSubmit={handleSubmitBillingDate} className="space-y-4">
            <Input
              label="Billing Date"
              type="date"
              value={
                edited.billing_date
                  ? format(
                      toZonedTime(
                        new Date(edited.billing_date),
                        "Asia/Jakarta"
                      ),
                      "yyyy-MM-dd"
                    )
                  : ""
              }
              onChange={(e: any) =>
                setEdited({ ...edited, billing_date: e.target.value })
              }
            />
            <Select
              label="Status Langganan"
              value={edited.is_subscribe?.toString()} // jadi string untuk selected
              onChange={(e: any) =>
                setEdited({
                  ...edited,
                  is_subscribe: e.target.value === "true",
                })
              }
              options={[
                { label: "Aktif", value: "true" },
                { label: "Non-Aktif", value: "false" },
              ]}
            />
            <Button type="submit">Update</Button>
          </form>
          <NotificationModal
            message={notif.message}
            type={notif.type}
            show={notif.show}
            onClose={() => setNotif((prev) => ({ ...prev, show: false }))}
          />
        </div>
      </div>
    </div>
  );
}
