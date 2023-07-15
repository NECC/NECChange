import { FeedPostsI } from "../interfaces/interfaces";



export default function FeedPost(props: FeedPostsI) {
    const { postsArray } = props
    
    // 1°, 2°, 3°, 4°, 5° ano
    const yearColor = [
        'green',
        'blue',
        'red',
        'purple',
        'orange'
    ]

    return (
        <div className="w-full h-full flex flex-col px-6">

            {
                postsArray.map((post) => (
                    <div key={post.tradeID} className="rounded-xl bg-white w-full h-32 border border-black border-black/25 m-3 shadow-lg relative">
                        <span className="absolute right-0 mr-3 mt-1 text-sm">
                            {
                                post.timePassed > 0 ? (
                                    `há ${post.timePassed} horas atrás`
                                ) : (
                                    `há menos de 1 hora`
                                )
                            }
                        </span>

                        <div className="p-4 flex items-center">
                            <div className="w-10 h-10 rounded-full bg-white border flex justify-center items-center">{post.profilePic}</div>
                            <span className="ml-2 text-[1.3em]">{post.displayName} (A{post.studentNumber}) - </span>
                            <span className={`ml-1 text-[1.3em] text-${yearColor[post.studentYear - 1]}-500`}>{post.studentYear}°Ano</span>
                        </div>

                    </div>
                ))
            }

        </div>
    );
}