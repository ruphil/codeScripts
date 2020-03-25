#include <iostream>

#include "libavutil/imgutils.h"
#include "libavutil/parseutils.h"
#include "libswscale/swscale.h"

int main()
{
    std::cout << "Starting...!\n";

    uint8_t* src_data[4], * dst_data[4];
    int src_linesize[4], dst_linesize[4];
    int src_w = 320, src_h = 240, dst_w, dst_h;
    enum AVPixelFormat src_pix_fmt = AV_PIX_FMT_YUV420P, dst_pix_fmt = AV_PIX_FMT_RGB24;
    const char* dst_size = NULL;
    const char* dst_filename = NULL;
    FILE* dst_file;
    int dst_bufsize;
    struct SwsContext* sws_ctx;
    int i, ret;

    dst_filename = "D:/cOut/scaled.mp4";
    dst_size = "720x480";

    av_parse_video_size(&dst_w, &dst_h, dst_size);

    return 0;
}
