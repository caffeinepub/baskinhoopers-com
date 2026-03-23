import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, Package, Plus, Shield, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCards,
  useDeleteCard,
  useIsAdmin,
  useUpdateCard,
} from "../hooks/useQueries";

const RARITIES = ["Common", "Rare", "Epic", "Legendary"];

const RARITY_COLORS: Record<string, string> = {
  Common: "bg-foreground/20 text-foreground/70",
  Rare: "bg-blue-500/20 text-blue-400",
  Epic: "bg-purple-500/20 text-purple-400",
  Legendary: "bg-gold/20 text-gold",
};

export default function AdminPanel() {
  const { identity, login } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: cards, isLoading: cardsLoading } = useCards();
  const deleteCard = useDeleteCard();
  const updateCard = useUpdateCard();
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    rarity: "Common",
    stock: "10",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function resetForm() {
    setForm({
      name: "",
      description: "",
      price: "",
      rarity: "Common",
      stock: "10",
    });
    setImageFile(null);
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.price) {
      toast.error("Name and price are required.");
      return;
    }
    setSubmitting(true);
    try {
      let imageBlob: ExternalBlob;
      if (imageFile) {
        const bytes = new Uint8Array(await imageFile.arrayBuffer());
        imageBlob = ExternalBlob.fromBytes(bytes);
      } else {
        imageBlob = ExternalBlob.fromURL("");
      }
      const id = crypto.randomUUID();
      await updateCard.mutateAsync({
        id,
        name: form.name,
        description: form.description,
        priceInCents: BigInt(Math.round(Number.parseFloat(form.price) * 100)),
        rarity: form.rarity,
        stock: BigInt(Number.parseInt(form.stock) || 0),
        imageId: imageBlob,
        createdAt: BigInt(Date.now()),
      });
      toast.success(`${form.name} added successfully!`);
      resetForm();
    } catch {
      toast.error("Failed to add card. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await deleteCard.mutateAsync(id);
      toast.success(`${name} deleted.`);
    } catch {
      toast.error("Failed to delete card.");
    }
  }

  if (!identity) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 p-8 text-center">
        <Shield className="h-16 w-16 text-foreground/20" />
        <h2 className="font-display text-3xl font-black uppercase tracking-tight text-foreground">
          Admin Access Required
        </h2>
        <p className="text-muted-foreground">
          Please log in to access the admin panel.
        </p>
        <Button
          onClick={login}
          className="bg-gold font-display font-black uppercase tracking-wider text-primary-foreground hover:bg-gold-dim"
          data-ocid="admin.primary_button"
        >
          LOGIN
        </Button>
      </div>
    );
  }

  if (adminLoading) {
    return (
      <div
        className="flex min-h-[60vh] items-center justify-center"
        data-ocid="admin.loading_state"
      >
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center">
        <Shield className="h-16 w-16 text-destructive/60" />
        <h2 className="font-display text-3xl font-black uppercase tracking-tight text-foreground">
          Access Denied
        </h2>
        <p className="text-muted-foreground">
          You don't have admin privileges.
        </p>
        <Button
          variant="outline"
          onClick={() => navigate({ to: "/" })}
          className="border-border font-display font-bold uppercase hover:border-gold hover:text-gold"
          data-ocid="admin.secondary_button"
        >
          BACK TO SHOP
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="font-display text-5xl font-black uppercase tracking-tight text-foreground">
          <span className="text-gold">Admin</span> Panel
        </h1>
        <p className="mt-2 text-muted-foreground">
          Manage your basketball card inventory.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Add Card Form */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 font-display text-2xl font-black uppercase tracking-tight text-foreground">
            <Plus className="mr-2 inline h-5 w-5 text-gold" />
            Add New Card
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label
                htmlFor="card-name"
                className="font-display text-xs font-bold uppercase tracking-widest text-foreground/70"
              >
                Card Name *
              </Label>
              <Input
                id="card-name"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="e.g. LeBron Rookie Foil"
                className="mt-1 border-border bg-input text-foreground placeholder:text-muted-foreground"
                data-ocid="admin.input"
              />
            </div>
            <div>
              <Label
                htmlFor="card-desc"
                className="font-display text-xs font-bold uppercase tracking-widest text-foreground/70"
              >
                Description
              </Label>
              <Textarea
                id="card-desc"
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="Card description..."
                rows={2}
                className="mt-1 border-border bg-input text-foreground placeholder:text-muted-foreground"
                data-ocid="admin.textarea"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="card-price"
                  className="font-display text-xs font-bold uppercase tracking-widest text-foreground/70"
                >
                  Price (USD) *
                </Label>
                <Input
                  id="card-price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, price: e.target.value }))
                  }
                  placeholder="9.99"
                  className="mt-1 border-border bg-input text-foreground"
                  data-ocid="admin.input"
                />
              </div>
              <div>
                <Label
                  htmlFor="card-stock"
                  className="font-display text-xs font-bold uppercase tracking-widest text-foreground/70"
                >
                  Stock
                </Label>
                <Input
                  id="card-stock"
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, stock: e.target.value }))
                  }
                  placeholder="10"
                  className="mt-1 border-border bg-input text-foreground"
                  data-ocid="admin.input"
                />
              </div>
            </div>
            <div>
              <Label className="font-display text-xs font-bold uppercase tracking-widest text-foreground/70">
                Rarity
              </Label>
              <Select
                value={form.rarity}
                onValueChange={(v) => setForm((p) => ({ ...p, rarity: v }))}
              >
                <SelectTrigger
                  className="mt-1 border-border bg-input text-foreground"
                  data-ocid="admin.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-border bg-popover text-foreground">
                  {RARITIES.map((r) => (
                    <SelectItem key={r} value={r} className="focus:bg-muted">
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="font-display text-xs font-bold uppercase tracking-widest text-foreground/70">
                Card Image
              </Label>
              <button
                type="button"
                className="mt-1 flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-6 transition-colors hover:border-gold/50"
                onClick={() => fileRef.current?.click()}
                onKeyDown={(e) => e.key === "Enter" && fileRef.current?.click()}
                data-ocid="admin.dropzone"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-32 rounded-lg object-cover"
                  />
                ) : (
                  <>
                    <Upload className="mb-2 h-8 w-8 text-foreground/30" />
                    <span className="font-display text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Click to upload image
                    </span>
                  </>
                )}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                data-ocid="admin.upload_button"
              />
            </div>
            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-gold font-display text-base font-black uppercase tracking-widest text-primary-foreground hover:bg-gold-dim"
              data-ocid="admin.submit_button"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding Card...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  ADD CARD
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Card List */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 font-display text-2xl font-black uppercase tracking-tight text-foreground">
            <Package className="mr-2 inline h-5 w-5 text-gold" />
            Inventory
            <span className="ml-2 text-sm font-bold text-muted-foreground">
              ({cards?.length ?? 0} cards)
            </span>
          </h2>
          {cardsLoading ? (
            <div className="space-y-3" data-ocid="admin.loading_state">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-lg border border-border p-3"
                >
                  <Skeleton className="h-12 w-9 rounded-md bg-muted" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-1/2 bg-muted" />
                    <Skeleton className="h-3 w-1/3 bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : cards?.length === 0 ? (
            <div className="py-12 text-center" data-ocid="admin.empty_state">
              <Package className="mx-auto mb-3 h-10 w-10 text-foreground/20" />
              <p className="font-display text-sm font-bold uppercase tracking-wide text-foreground/40">
                No cards yet
              </p>
            </div>
          ) : (
            <div className="max-h-[600px] space-y-3 overflow-y-auto pr-1">
              {cards?.map((card, i) => (
                <div
                  key={card.id}
                  className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-3 transition-colors hover:border-gold/30"
                  data-ocid={`admin.item.${i + 1}`}
                >
                  <div className="h-12 w-9 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                    {card.imageId?.getDirectURL() ? (
                      <img
                        src={card.imageId.getDirectURL()}
                        alt={card.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <span className="font-display text-xs font-black text-foreground/30">
                          {card.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-sm font-black uppercase tracking-tight text-foreground">
                      {card.name}
                    </p>
                    <div className="mt-0.5 flex items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 font-display text-[9px] font-black uppercase tracking-wider ${RARITY_COLORS[card.rarity] ?? RARITY_COLORS.Common}`}
                      >
                        {card.rarity}
                      </span>
                      <span className="font-display text-xs font-bold text-gold">
                        ${(Number(card.priceInCents) / 100).toFixed(2)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Stock: {card.stock.toString()}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(card.id, card.name)}
                    className="h-8 w-8 flex-shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    data-ocid={`admin.delete_button.${i + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
