import ffmpeg

inputfile = "D:/pyIn/input.mp4"

outPath = "D:/pyOut/"
outfile = outPath + "output.mp4"

print(inputfile, outfile)

stream = ffmpeg.input(inputfile)
stream = ffmpeg.hflip(stream)
stream = ffmpeg.output(stream, outfile)
ffmpeg.run(stream)