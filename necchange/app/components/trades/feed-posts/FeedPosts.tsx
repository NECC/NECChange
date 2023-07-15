import { FeedPostsI } from "../interfaces/interfaces";



export default function FeedPost(props: FeedPostsI) {
    const { postsArray } = props
    
    // 1°, 2°, 3°, 4°, 5° ano
    const yearColor = [
        'text-green-500',
        'text-blue-500',
        'text-red-500',
        'text-purple-500',
        'text-orange-500'
    ]

    return (
        <div className="w-full h-full flex flex-col px-6">

            {
                postsArray.map((post) => (
                    <div key={post.tradeID} className="rounded-xl bg-white w-full border border-black border-black/25 m-3 shadow-lg relative flex flex-col">
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
                            <span className="ml-2 text-[1.9em]">{post.displayName} (A{post.studentNumber}) - </span>
                            <span className={`ml-1 text-[1.3em] ${yearColor[post.studentYear - 1]}`}>{post.studentYear}°Ano</span>
                        </div>

                        <span className="px-4 pb-4">{post.displayName} solicitou uma troca de turno da UC <strong>{post.fromUC}</strong></span>

                    </div>
                ))
            }

        </div>
    );
}