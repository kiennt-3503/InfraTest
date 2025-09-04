import React from 'react';

interface LoadingChatRoomDetailProps {
  handleCloseDetail: () => void;
}

const LoadingChatRoomDetail: React.FC<LoadingChatRoomDetailProps> = ({
  handleCloseDetail
}) => {

  return (
    <div className="flex flex-col rounded-none bg-base-100 w-full">
      <div className="flex items-center gap-2 p-4 border-b border-base-300 border-dashed">
        <div className="flex items-center gap-2 text-sm font-medium w-full">
          <button
            type="button"
            className="btn btn-square btn-danger"
            onClick={handleCloseDetail}
          >
            ←
          </button>
          <span className="text-xl">読み込み中...</span>
        </div>
      </div>
      <div className="flex-1 p-4 overflow-y-auto flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          <span className="text-sm text-gray-600">
            チャットルームの詳細を読み込み中...
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoadingChatRoomDetail;
