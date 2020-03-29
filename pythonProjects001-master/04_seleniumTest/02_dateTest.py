from datetime import datetime
from datetime import timedelta

# x = datetime.now() + timedelta(hours = 5.5)
x = datetime.now() - timedelta(days = 1)

# print(x.year, x.month, x.day, x.hour, x.minute, x.second)
# print(x.strftime('%b'), x.strftime('%B'))
# print(x.strftime('%a'), x.strftime('%A'))
# print(x.strftime('%c'))
# print(x.strftime('%C'))
# print(x.strftime('%d'), x.strftime('%D'))

# url = "https://www1.nseindia.com/ArchieveSearch?h_filetype=eqbhav&date=27-03-2020&section=EQ"

url = "https://www1.nseindia.com/ArchieveSearch?h_filetype=eqbhav&date={}-{}-{}&section=EQ".format(str(x.day).zfill(2), str(x.month).zfill(2), x.year)
print(url)