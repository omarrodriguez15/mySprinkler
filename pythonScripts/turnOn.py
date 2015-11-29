import datetime

now = datetime.datetime.now()

with open("TurnOn.txt", "a") as myfile:
    myfile.write("Turn On at ")
    myfile.write(str(now))
    myfile.write("\n")