from __future__ import unicode_literals
import pandas
import youtube_dl

in_file = "D:\TREASURE\Music\carnatic_lesson.xlsx"

vocal_df = pandas.read_excel(in_file, "VOCAL")
flute_df = pandas.read_excel(in_file, "FLUTE")

for index, row in vocal_df.iterrows():
    url = row["Youtube Link"]
    # print (row["Youtube Link"])
    outtemplate = str(index + 1) + "-VOCAL" + "-%(title)s.%(ext)s"
    ydl_opts = {
        'outtmpl': outtemplate
    }
    # print (outtemplate)
    with youtube_dl.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])



# help(youtube_dl)