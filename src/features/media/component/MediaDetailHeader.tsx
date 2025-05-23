import React from "react";
import type { Media } from "../../../api/types";
import type { UseMediaGridReturn } from "../useMediaGrid";


interface MediaDetailHeaderProps {
    data: Media;
    getPlatformName: UseMediaGridReturn['getPlatformName'];
}

const MediaDetailHeader: React.FC<MediaDetailHeaderProps> = ({data, getPlatformName}) => {
     return (
        <>
            <h1 className="text-2xl font-bold mb-4">{data.title}</h1>
            <hr className="border-t border-gray-600 dark:border-gray-300 my-4"/>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <dt className="font-semibold text-md">플랫폼</dt>
                <dd className="text-md">{getPlatformName(data.platform_id) || "알 수 없음"}</dd>
                <dt className="font-semibold text-md">생성일</dt>
                <dd className="text-md">{new Date(data.created_at).toLocaleString()}</dd>
            </dl>
            <hr className="border-t border-gray-600 dark:border-gray-300 my-4"/>
        </>
    );
}

export default MediaDetailHeader;