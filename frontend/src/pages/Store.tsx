import { useMemo, useState } from 'react'
import { storeItems } from '@/constants/store-items'
import { StoreItem } from '@/components/store/StoreItem'
import type { StoreItemType as StoreItemKind } from '@/types/store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerXClose,
} from '@/components/ui/drawer'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ArrowRight, Check, Coins, CreditCard, Sparkles, Trash2 } from 'lucide-react'

type StoreFilter = 'all' | StoreItemKind

const categoryLabels: Record<StoreFilter, string> = {
  all: 'All',
  sticker: 'Stickers',
  board: 'Boards',
}

const initialCpBalance = 0

const coinPackages = [
  { amount: 50, imageUrl: '/store/50_coin.png', label: 'Starter' },
  { amount: 100, imageUrl: '/store/100_coin.png', label: 'Popular', featured: true },
  { amount: 1000, imageUrl: '/store/1000_coin.png', label: 'Best value' },
]

export const Store = () => {
  const [activeFilter, setActiveFilter] = useState<StoreFilter>('all')
  const [selectedItemIds, setSelectedItemIds] = useState<number[]>([])
  const [cpBalance, setCpBalance] = useState(initialCpBalance)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isCoinDialogOpen, setIsCoinDialogOpen] = useState(false)

  const counts = useMemo(
    () => ({
      all: storeItems.length,
      sticker: storeItems.filter(item => item.type === 'sticker').length,
      board: storeItems.filter(item => item.type === 'board').length,
    }),
    []
  )

  const visibleItems = useMemo(() => {
    if (activeFilter === 'all') {
      return storeItems
    }

    return storeItems.filter(item => item.type === activeFilter)
  }, [activeFilter])

  const selectedItems = useMemo(
    () => storeItems.filter(item => selectedItemIds.includes(item.id)),
    [selectedItemIds]
  )

  const selectedItemIdSet = useMemo(() => new Set(selectedItemIds), [selectedItemIds])

  const cartTotal = selectedItems.reduce((total, item) => total + item.price, 0)
  const remainingCp = cpBalance - cartTotal
  const needsCoins = selectedItems.length > 0 && remainingCp < 0
  const shortfallCp = Math.max(0, cartTotal - cpBalance)

  const formattedCartTotal = cartTotal.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })

  const toggleItem = (itemId: number) => {
    setSelectedItemIds(current =>
      current.includes(itemId)
        ? current.filter(selectedId => selectedId !== itemId)
        : [...current, itemId]
    )
  }

  const removeItem = (itemId: number) => {
    setSelectedItemIds(current => current.filter(selectedId => selectedId !== itemId))
  }

  const addCoins = (amount: number) => {
    setCpBalance(current => current + amount)
    setIsCoinDialogOpen(false)
  }

  const confirmPurchase = () => {
    if (selectedItems.length === 0) {
      return
    }

    if (cartTotal > cpBalance) {
      setIsCoinDialogOpen(true)
      return
    }

    setCpBalance(current => current - cartTotal)
    setSelectedItemIds([])
    setIsDrawerOpen(false)
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
      <section className="flex flex-col gap-5 border-b border-border pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <Badge variant="outline" className="mb-3 h-6 rounded-md px-2 text-xs">
            <Sparkles className="size-3" />
            Cosmetics
          </Badge>
          <h1 className="text-3xl font-semibold tracking-normal text-foreground sm:text-4xl">Store</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">
            Browse board themes and stickers, preview sounds where available, and select the item you want to buy.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:items-end">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
            <span className="inline-flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Coins className="size-4" />
            </span>
            <div>
              <p className="text-xs text-muted-foreground">Your CP</p>
              <p className="text-sm font-semibold text-foreground">{cpBalance.toLocaleString()} CP</p>
            </div>
          </div>

          <div className="flex min-w-0 flex-wrap items-center gap-2 rounded-lg border border-border bg-card p-1">
            {(Object.keys(categoryLabels) as StoreFilter[]).map(filter => (
              <Button
                key={filter}
                variant={activeFilter === filter ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveFilter(filter)}
                className="h-8 rounded-md px-3"
                aria-pressed={activeFilter === filter}
              >
                {categoryLabels[filter]}
                <span className="ml-1 text-xs opacity-75">{counts[filter]}</span>
              </Button>
            ))}
          </div>
        </div>
      </section>

      <div>
        <section className="min-w-0">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-foreground">{categoryLabels[activeFilter]}</h2>
              <p className="text-sm text-muted-foreground">{visibleItems.length} items available</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visibleItems.map(item => (
              <StoreItem
                key={item.id}
                item={item}
                isSelected={selectedItemIdSet.has(item.id)}
                onToggle={() => toggleItem(item.id)}
              />
            ))}
          </div>
        </section>

      </div>

      {selectedItems.length > 0 ? (
        <div className="fixed inset-x-0 bottom-20 z-40 px-4 sm:bottom-6">
          <div className="mx-auto flex max-w-3xl flex-col gap-3 rounded-lg border border-border bg-popover p-3 text-popover-foreground shadow-lg sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Coins className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {selectedItems.length} {selectedItems.length === 1 ? 'item' : 'items'} selected
                </p>
                <p className="text-xs text-muted-foreground">
                  Total {formattedCartTotal} CP · Balance {cpBalance.toLocaleString()} CP
                </p>
              </div>
            </div>

            <Button
              className="h-10 rounded-md px-4 font-semibold sm:min-w-40"
              onClick={() => setIsDrawerOpen(true)}
            >
              <CreditCard className="size-4" />
              Review purchase
            </Button>
          </div>
        </div>
      ) : null}

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} >
        <DrawerContent>
          <DrawerHeader>
            <div>
              <DrawerTitle>Confirm purchase</DrawerTitle>
              <DrawerDescription>
                Review selected store items before spending your CP.
              </DrawerDescription>
            </div>
            <DrawerXClose />
          </DrawerHeader>

          <DrawerBody className="space-y-3">
            {selectedItems.map(item => (
              <div key={item.id} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-md bg-muted p-2">
                  <img src={item.imageUrl} alt="" className="max-h-full max-w-full object-contain" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{item.name}</p>
                  <p className="text-sm capitalize text-muted-foreground">{item.type}</p>
                </div>
                <p className="text-sm font-semibold text-foreground">{item.price.toLocaleString()} CP</p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-md text-muted-foreground hover:text-destructive"
                  onClick={() => removeItem(item.id)}
                  aria-label={`Remove ${item.name}`}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </DrawerBody>

          <DrawerFooter>
            <div className="mb-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-md bg-muted/60 p-3">
                <p className="text-xs text-muted-foreground">Your CP</p>
                <p className="text-base font-semibold text-foreground">{cpBalance.toLocaleString()} CP</p>
              </div>
              <div className="rounded-md bg-muted/60 p-3">
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-base font-semibold text-foreground">{formattedCartTotal} CP</p>
              </div>
              <div className="rounded-md bg-muted/60 p-3">
                <p className="text-xs text-muted-foreground">Remaining</p>
                <p className={needsCoins ? 'text-base font-semibold text-destructive' : 'text-base font-semibold text-primary'}>
                  {remainingCp.toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })}{' '}
                  CP
                </p>
              </div>
            </div>

            <Button
              className="h-10 w-full rounded-md font-semibold"
              disabled={selectedItems.length === 0}
              onClick={confirmPurchase}
            >
              {needsCoins ? <Coins className="size-4" /> : <Check className="size-4" />}
              {needsCoins ? 'Buy CP to continue' : 'Confirm purchase'}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Dialog open={isCoinDialogOpen} onOpenChange={setIsCoinDialogOpen}>
        <DialogContent className="max-w-2xl gap-0 overflow-hidden p-0">
          <div className="relative overflow-hidden border-b border-border bg-muted/40 px-4 py-5 sm:px-6 sm:py-6">
            <div className="pointer-events-none absolute right-3 top-4 opacity-20 sm:right-5 sm:top-5">
              <img src="/store/1000_coin.png" alt="" className="h-20 w-20 animate-store-coin-spin object-contain sm:h-28 sm:w-28" />
            </div>

            <DialogHeader className="relative max-w-md pr-10 sm:pr-12">
              <Badge variant="secondary" className="mb-2 h-6 w-fit rounded-md px-2 text-xs">
                <Sparkles className="size-3" />
                CP top-up
              </Badge>
              <DialogTitle>Buy CP coins</DialogTitle>
              <DialogDescription>
                Add enough CP to complete your selected store purchase.
              </DialogDescription>
            </DialogHeader>

            <div className="relative mt-4 grid grid-cols-3 gap-2 sm:mt-5 sm:gap-3">
              <div className="rounded-lg border border-border bg-card/80 p-3">
                <p className="text-xs text-muted-foreground">Current balance</p>
                <p className="mt-1 text-sm font-semibold text-foreground sm:text-lg">{cpBalance.toLocaleString()} CP</p>
              </div>
              <div className="rounded-lg border border-border bg-card/80 p-3">
                <p className="text-xs text-muted-foreground">Purchase total</p>
                <p className="mt-1 text-sm font-semibold text-foreground sm:text-lg">{formattedCartTotal} CP</p>
              </div>
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3">
                <p className="text-xs text-destructive/85">Needed</p>
                <p className="mt-1 text-sm font-semibold text-destructive sm:text-lg">
                  {shortfallCp.toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })}{' '}
                  CP
                </p>
              </div>
            </div>
          </div>

          <DialogHeader className="px-4 pt-4 sm:px-6 sm:pt-5">
            <DialogTitle className="text-base">Choose a coin pack</DialogTitle>
            <DialogDescription>
              The selected pack is added to your CP balance immediately in this demo.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 px-4 pb-4 pt-3 sm:grid-cols-3 sm:px-6 sm:pb-6">
            {coinPackages.map(coinPackage => (
              <button
                key={coinPackage.amount}
                type="button"
                onClick={() => addCoins(coinPackage.amount)}
                className={`group relative flex min-h-0 items-center gap-3 overflow-hidden rounded-lg border bg-card p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring sm:min-h-48 sm:flex-col sm:items-stretch sm:p-4 ${
                  coinPackage.featured ? 'border-primary/50 ring-1 ring-primary/20' : 'border-border'
                }`}
              >
                {coinPackage.featured ? (
                  <span className="absolute right-3 top-3 rounded-md bg-primary px-2 py-1 text-[0.7rem] font-semibold text-primary-foreground">
                    Popular
                  </span>
                ) : null}

                <div className="flex size-16 shrink-0 items-center justify-center rounded-md bg-muted/60 sm:mb-4 sm:h-24 sm:w-full">
                  <img
                    src={coinPackage.imageUrl}
                    alt={`${coinPackage.amount} CP coins`}
                    className="h-12 w-12 object-contain drop-shadow-lg transition group-hover:animate-store-coin-spin sm:h-20 sm:w-20"
                  />
                </div>

                <div className="min-w-0 sm:mt-auto">
                  <p className="text-xs font-medium text-muted-foreground">{coinPackage.label}</p>
                  <p className="mt-1 text-lg font-semibold text-foreground sm:text-xl">
                    {coinPackage.amount.toLocaleString()} CP
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    Add coins
                    <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Store
