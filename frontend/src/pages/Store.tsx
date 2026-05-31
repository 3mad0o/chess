import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { storeItems } from '@/constants/store-items'
import { StoreItem } from '@/components/store/StoreItem'

export const Store = () => {
  return (
    <div className="p-6">
      <Card className="space-y-6">
        <CardHeader>
          <CardTitle>Store</CardTitle>
          <CardDescription>Purchase skins, skins previews, and sound effects</CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4 lg:grid-cols-2">
          {storeItems.map((item) => (
            <StoreItem key={item.id} item={item} />
          ))}
        </CardContent>

        <CardFooter>
          <div className="text-sm text-muted-foreground">Store is a demo — purchases are not enabled.</div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Store
