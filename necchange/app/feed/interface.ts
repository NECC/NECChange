export interface FeedPostsI {
    postsArray: Array<FeedPostI>
}


export interface FeedPostI {
    fromUC: string,     // UC name             
    fromType: number,    // UC Type
    fromShift: number,   // UC Shift
    toUC: string, 
    toType: number,
    toShift: number,
    tradeID: number,
    studentNumber: number,
    studentYear: number,
    displayName: string,
    timePassed: number,
    profilePic: string,
}