import { useState, useRef, useCallback } from 'react'
import { Heart, MessageSquare, Share2, MoreHorizontal, Bookmark } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'

type Story = {
  id: string
  username: string
  avatar: string
  seen: boolean
}

type Post = {
  id: string
  username: string
  avatar: string
  content: string
  images?: string[]
  likes: number
  comments: number
  timeAgo: string
  liked: boolean
  saved: boolean
}

const Index = () => {
  const [stories, setStories] = useState<Story[]>([
    { id: '1', username: 'your_story', avatar: 'https://randomuser.me/api/portraits/women/1.jpg', seen: false },
    { id: '2', username: 'user1', avatar: 'https://randomuser.me/api/portraits/men/1.jpg', seen: false },
    { id: '3', username: 'user2', avatar: 'https://randomuser.me/api/portraits/women/2.jpg', seen: true },
    { id: '4', username: 'user3', avatar: 'https://randomuser.me/api/portraits/men/2.jpg', seen: false },
    { id: '5', username: 'user4', avatar: 'https://randomuser.me/api/portraits/women/3.jpg', seen: true },
  ])

  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      username: 'traveler',
      avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
      content: 'Beautiful sunset at the beach today! 🌅 #vacation #summer',
      images: [
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
        'https://images.unsplash.com/photo-1519046904884-53103b34b206'
      ],
      likes: 124,
      comments: 23,
      timeAgo: '2h ago',
      liked: false,
      saved: false
    },
    {
      id: '2',
      username: 'foodlover',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      content: 'Homemade pasta for dinner tonight! 🍝 #foodie #homecooking',
      images: ['https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb'],
      likes: 89,
      comments: 12,
      timeAgo: '4h ago',
      liked: true,
      saved: true
    },
    {
      id: '3',
      username: 'fitnessguru',
      avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
      content: 'Morning workout complete! 💪 #fitness #healthylifestyle',
      likes: 215,
      comments: 42,
      timeAgo: '6h ago',
      liked: false,
      saved: false
    }
  ])

  const [loading, setLoading] = useState(false)
  const observer = useRef<IntersectionObserver>()

  const lastPostRef = useCallback((node: HTMLDivElement) => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        // Simulate loading more posts
        setLoading(true)
        setTimeout(() => {
          setPosts(prev => [
            ...prev,
            {
              id: (prev.length + 1).toString(),
              username: `user${prev.length + 1}`,
              avatar: `https://randomuser.me/api/portraits/${prev.length % 2 === 0 ? 'women' : 'men'}/${prev.length + 1}.jpg`,
              content: `This is post number ${prev.length + 1} with some sample content.`,
              likes: Math.floor(Math.random() * 200),
              comments: Math.floor(Math.random() * 50),
              timeAgo: `${prev.length + 1}h ago`,
              liked: false,
              saved: false
            }
          ])
          setLoading(false)
        }, 1000)
      }
    })
    
    if (node) observer.current.observe(node)
  }, [loading])

  const toggleLike = (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          liked: !post.liked,
          likes: post.liked ? post.likes - 1 : post.likes + 1
        }
      }
      return post
    }))
  }

  const toggleSave = (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          saved: !post.saved
        }
      }
      return post
    }))
  }

  const markStoryAsSeen = (storyId: string) => {
    setStories(prev => prev.map(story => {
      if (story.id === storyId) {
        return {
          ...story,
          seen: true
        }
      }
      return story
    }))
  }

  return (
    <div className="max-w-xl mx-auto pb-20">
      {/* Stories */}
      <div className="bg-white p-4 mb-4 overflow-x-auto">
        <div className="flex space-x-4">
          {stories.map(story => (
            <div 
              key={story.id} 
              className="flex flex-col items-center space-y-1"
              onClick={() => markStoryAsSeen(story.id)}
            >
              <div className={`p-0.5 rounded-full ${story.seen ? 'bg-gray-200' : 'bg-gradient-to-tr from-yellow-400 to-pink-500'}`}>
                <Avatar className="h-16 w-16 border-2 border-white">
                  <AvatarImage src={story.avatar} />
                  <AvatarFallback>{story.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>
              <span className="text-xs truncate w-16 text-center">{story.username}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {posts.map((post, index) => (
          <Card 
            key={post.id} 
            className="border-none shadow-sm"
            ref={index === posts.length - 1 ? lastPostRef : null}
          >
            {/* Post Header */}
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={post.avatar} />
                  <AvatarFallback>{post.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{post.username}</p>
                  <p className="text-xs text-gray-500">{post.timeAgo}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            {/* Post Content */}
            <div className="px-4 pb-2">
              <p>{post.content}</p>
            </div>

            {/* Post Images */}
            {post.images && (
              <div className="relative">
                <Carousel className="w-full">
                  <CarouselContent>
                    {post.images.map((image, idx) => (
                      <CarouselItem key={idx}>
                        <img 
                          src={image} 
                          alt={`Post by ${post.username}`} 
                          className="w-full aspect-square object-cover"
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {post.images.length > 1 && (
                    <>
                      <CarouselPrevious className="left-2" />
                      <CarouselNext className="right-2" />
                    </>
                  )}
                </Carousel>
              </div>
            )}

            {/* Post Actions */}
            <div className="p-3">
              <div className="flex justify-between mb-2">
                <div className="flex space-x-4">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => toggleLike(post.id)}
                  >
                    <Heart 
                      className={`h-5 w-5 ${post.liked ? 'fill-red-500 text-red-500' : ''}`} 
                    />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MessageSquare className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => toggleSave(post.id)}
                >
                  <Bookmark 
                    className={`h-5 w-5 ${post.saved ? 'fill-black' : ''}`} 
                  />
                </Button>
              </div>
              
              <p className="font-medium text-sm">{post.likes.toLocaleString()} likes</p>
              <p className="text-sm text-gray-500">{post.comments.toLocaleString()} comments</p>
            </div>
          </Card>
        ))}
        {loading && (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Index