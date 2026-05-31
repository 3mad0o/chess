
import { Link } from "react-router"

import profile from "/profile.png"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

import { IoArrowForwardOutline } from "react-icons/io5";
import { VscTriangleRight } from "react-icons/vsc";
import { Badge } from "@/components/ui/badge"
import { CgLivePhoto } from "react-icons/cg";
import { StoreItem } from "@/components/store/StoreItem"
import { FaRegChessKnight } from "react-icons/fa6";
import { storeItems } from "@/constants/store-items"


export const Home = () => {
  return (
    <>
      <div className="relative min-h-screen">
        <div className="absolute inset-0 bg-[url('/hero.png')] bg-cover bg-center opacity-50"></div>
        <div className="absolute   inset-0 p-4 z-50 space-y-20">
          {/* hero section */}
          <div className="grid md:grid-cols-3 gap-8 ">
            <div className="md:col-span-2 flex flex-col justify-center items-start gap-16 ">
              <div className="flex flex-col gap-4">
                <h1 className="text-4xl font-bold text-white">
                  Master the
                  <span className="text-primary"> Silence </span>
                  of the Board.

                </h1>
                <p className="text-lg text-white">Experience chess at its highest level.
                  No distractions, just pure strategy in a world-class environment designed for the elite..
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Button className="px-8 py-6 text-lg" size={'lg'} asChild>
                  <div>

                    <Link to="/play">Play Online</Link>
                    <FaRegChessKnight className="mr-2" />


                  </div>
                </Button>
                <Button className="px-8 py-6 text-lg bg-neutral-800" size={'lg'} variant="outline" asChild>
                  <Link to="/learn">Play Vs Bot</Link>
                </Button>

              </div>
            </div>

            <div className="flex justify-center items-center w-full cols-span-1">
              <Card className="p-4 rounded-sm w-full">
                <div className="flex flex-row gap-4 items-center">
                  <img src={profile} alt="Profile" className="w-16 h-16  shadow-lg" />
                  <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-semibold">Emad Jaber</h2>
                    <p className="text-sm text-primary">Chess Enthusiast</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">
                    "Chess is the gymnasium of the mind." - Blaise Pascal
                  </p>

                </div>

                <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2">
                  <div className="bg-neutral-800 p-4 flex flex-col gap-4 justify-center items-center">
                    <p className="">Blitz Rating</p>
                    <p className="text-2xl font-bold text-primary">1500</p>
                  </div>

                  <div className="bg-neutral-800 p-4 flex flex-col gap-4 justify-center items-center">
                    <p className="">Global Rank</p>
                    <p className="text-2xl font-bold text-primary">#456</p>
                  </div>
                </div>


                <div className="mt-4 flex flex-col gap-2 justify-center ">
                  <div className="flex flex-row justify-between items-center">
                    <p>Recent Win Rate</p>
                    <p className="text-primary">68%</p>

                  </div>

                  <Progress value={68} />
                </div>

                <div className="mt-4">
                  <Button variant="link" className="w-full" asChild>
                    <div className="flex flex-row items-center justify-center">
                      <Link to="/profile">View Detailed Analytics</Link>
                      <IoArrowForwardOutline className="ml-2" />
                    </div>

                  </Button>
                </div>


              </Card>
            </div>


          </div>


          {/* live matches section */}
          <Card className="mt-8 p-4 rounded-sm w-full">
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
              <h2 className="text-2xl font-bold">Live Arena</h2>
              <Button variant="link" size="sm" asChild>
                <Link to="/live">View All</Link>
              </Button>
            </div>

            <div className="mt-4 grid grid-cols-1  gap-4">
              {/* Match 1 */}
              <Card className="p-4 bg-neutral-800 rounded-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-col gap-2 ">
                    <Badge variant="outline" className="bg-red-200/20 text-red-200 flex items-center gap-1 rounded-sm">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                      Live
                    </Badge>
                    {/* man vs man */}
                    <p className="text-lg font-semibold">John Doe
                      <span className="text-primary"> (2860) </span>
                      vs
                      Jane Smith
                      <span className="text-primary"> (2890) </span>
                    </p>

                    <div className="flex flex-row gap-2 items-center  ">
                      <CgLivePhoto />
                      <p className="text-sm text-muted-foreground">128k viewers</p>
                    </div>
                  </div>
                  <Button variant="default" size="lg" asChild>
                    <div>
                      <Link to="/live/123">Watch Match</Link>
                      <VscTriangleRight className="ml-0" />
                    </div>
                  </Button>


                </div>

              </Card>


              {/* Match 3 */}
              <Card className="p-4 bg-neutral-800 rounded-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-col gap-2 ">
                    <Badge variant="outline" className="bg-red-200/20 text-red-200 flex items-center gap-1 rounded-sm">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                      Live
                    </Badge>
                    {/* man vs man */}
                    <p className="text-lg font-semibold">John Doe
                      <span className="text-primary"> (2860) </span>
                      vs
                      Jane Smith
                      <span className="text-primary"> (2890) </span>
                    </p>

                    <div className="flex flex-row gap-2 items-center  ">
                      <CgLivePhoto />
                      <p className="text-sm text-muted-foreground">128k viewers</p>
                    </div>
                  </div>
                  <Button variant="default" size="lg" asChild>
                    <div>
                      <Link to="/live/123">Watch Match</Link>
                      <VscTriangleRight className="ml-0" />
                    </div>
                  </Button>


                </div>

              </Card>


              {/* Match 2 */}
              <Card className="p-4 bg-neutral-800 rounded-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-col gap-2 ">
                    <Badge variant="outline" className="bg-red-200/20 text-red-200 flex items-center gap-1 rounded-sm">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                      Live
                    </Badge>
                    {/* man vs man */}
                    <p className="text-lg font-semibold">John Doe
                      <span className="text-primary"> (2860) </span>
                      vs
                      Jane Smith
                      <span className="text-primary"> (2890) </span>
                    </p>

                    <div className="flex flex-row gap-2 items-center  ">
                      <CgLivePhoto />
                      <p className="text-sm text-muted-foreground">128k viewers</p>
                    </div>
                  </div>
                  <Button variant="default" size="lg" asChild>
                    <div>
                      <Link to="/live/123">Watch Match</Link>
                      <VscTriangleRight className="ml-0" />
                    </div>
                  </Button>


                </div>

              </Card>
            </div>
          </Card>


          {/* featured collections section */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-row justify-between items-center">
              <h2 className="text-2xl font-bold">Featured Collections</h2>
              <Button variant="link" size="sm" asChild>
                <Link to="/collections">View All</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {
                storeItems.map((item) => (
                 <StoreItem  key={item.id} item={item} />
                ))
              }
            </div>

          </div>


        </div>

      </div>
    </>
  )
}
