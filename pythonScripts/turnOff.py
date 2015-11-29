import datetime

now = datetime.datetime.now()

with open("TurnOff.txt", "a") as myfile:
    myfile.write("Turn Off at ")
    myfile.write(str(now))
    myfile.write("\n")