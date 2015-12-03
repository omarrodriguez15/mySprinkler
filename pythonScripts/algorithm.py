#!/usr/bin/python

from datetime import datetime
import socket, sys, json,time, pprint,math,time
from pymongo import MongoClient
from bson.objectid import ObjectId

##################### Evapotranspiration formula #####################

def tempmean(Tempmax, Tempmin): #Tmean
	return (Tempmax+Tempmin)/2

def dslope(Tempmean): #D
	return 4098*(.6108*math.exp(17.27*Tempmean/(Tempmean+237.3)))/((Tempmean+237.3)**2)

def psychrometricconstant(Pressure): #gamma
	return .665*(10**-3)*Pressure

def saturationvapourpressure(Temp): #es
	return .6108*math.exp(17.27*Temp/(Temp+237.3))

def meansatvapourpressure(Tempmax, Tempmin): 
	return	(saturationvapourpressure(Tempmax)+saturationvapourpressure(Tempmin))/2

def actualvapourpressure(Tempmin,RHmax): #ea
	return saturationvapourpressure(Tempmin)*RHmax/100


def extraterrestrialradiation(lat, J): #Ra

	radianlat=(math.pi/180)*lat
	dr=1+.033*math.cos((2*math.pi/365)*J)
	d=.409*math.sin((2*math.pi*J/365)-1.39)
	ws=math.acos(-math.tan(radianlat)*math.tan(d))
	Ra=(24*60/math.pi)*.0820*dr*(ws*math.sin(radianlat)*math.sin(d)+math.cos(radianlat)*math.cos(d)*math.sin(ws))
	return Ra

def solarradiation(Tempmax,Tempmin, Ra): #Rs
	return .16*math.sqrt(Tempmax-Tempmin)*Ra

def clearskysolarradiation(elevation, Ra): #Rso
	return (.75+(elevation*.00002))*Ra

def netsolarradiation(Rs): #Rns
	return .77*Rs

def stefanboltzman(Temp):
	return 4.903*(10**-9)*((Temp+273.16)**4)

def netlongwaveradiation(Tempmax, Tempmin, ea, Rs, Rso): #Rnl
	Tmax=stefanboltzman(Tempmax)
	Tmin=stefanboltzman(Tempmin)
	return ((Tmax+Tmin)/2)*(.34-.14*math.sqrt(ea))*((1.35*Rs/Rso)-.35)

def netradiation(Rns, Rnl): #Rn
	return Rns-Rnl

def Penman_Monteith(Tempmax,Tempmin, RHmax, windspeed, Pressure, dt, lat, elevation):
	J=datetime.utcfromtimestamp(int(dt)).timetuple().tm_yday
	Tempmean=tempmean(Tempmax,Tempmin)
	D=dslope(Tempmean)
	gamma=psychrometricconstant(Pressure)
	es=meansatvapourpressure(Tempmax,Tempmin)
	ea=actualvapourpressure(Tempmin,RHmax)
	#Radiation Calculations
	Ra=extraterrestrialradiation(lat,J)
	Rs=solarradiation(Tempmax,Tempmin,Ra)
	Rso=clearskysolarradiation(elevation, Ra)
	Rns=netsolarradiation(Rs)
	Rnl=netlongwaveradiation(Tempmax,Tempmin,ea,Rs,Rso)
	Rn=netradiation(Rns,Rnl)

	var1=(.408*D*Rn)/(D+gamma*(1+(.34*windspeed)))
	var2=(900/(Tempmean+273))*windspeed*(es-ea)*gamma/(D+gamma*(1+(.34*windspeed)))
	eto=var1+var2

	return eto
####################################################################

def weeklyschedule(dbcollection, dt):
	weather=dbcollection.find_one({"cnt" :7, "list.0.dt": dt}) #take out cnt after finalizing database schema

	weeklyforecast=weather['list']
	days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday', 'Saturday']
	week=dict.fromkeys(days)
	schedule=dict.fromkeys(days, 'No')
	properties=['dt', 'humidity', 'speed', 'tempmax', 'tempmin', 'rain', 'pressure', 'lat', 'elevation']
	latitude=weather['city']['coord']['lat']
	elevation=int(weather['city']['elevation'])

	##################### extracting info #####################
	
	#adjust for new input
	for day in week:
		week[day]={'dt': None, 'humidity': None, 'speed': None, 'tempmax': None,'tempmin': None, 'rain': None, 'pressure': None, 'lat': None, 'elevation': None}
	for weatherday,day in enumerate(days):
		for info in properties:
			if info in weeklyforecast[weatherday].keys():
				week[day][info]=weeklyforecast[weatherday][info]
			elif info=='lat':
				week[day]['lat']=latitude
			elif info=='elevation':
				week[day]['elevation']=elevation
			elif info=='tempmax':
				week[day]['tempmax']=weeklyforecast[weatherday]['temp']['max']
			elif info=='tempmin':
				week[day]['tempmin']=weeklyforecast[weatherday]['temp']['min']
			else:
				week[day][info]=0

	printer.pprint(week)
	##################### Algorithm #####################

	for day in week: #for each day of the week find the evapotranspiration
		dailyevapotranspiration=Penman_Monteith(week[day]['tempmax'], week[day]['tempmin'],week[day]['humidity'],week[day]['speed'], week[day]['pressure'],week[day]['dt'],week[day]['lat'],week[day]['elevation'])#need pressure, lat and elevation
		print day, dailyevapotranspiration
		if dailyevapotranspiration>float(week[day]['rain']):
			schedule[day]='Yes'

	return schedule

def dailyscheduler(dbcollection, dt,weeklyschedule):
	dayofweek=str(datetime.utcfromtimestamp(dt).weekday())
	weather=dbcollection.find_one({"timestamp": dt}) #fix this after finalizing database
	days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday', 'Saturday']
	schedule=dict.fromkeys(days, 'No')
	for day in days:
		schedule[day]=weeklyschedule[day]
	
	shouldwater='No'
	printer.pprint(weather)
	dailyevapotranspiration=Penman_Monteith(weather['temp_max'], weather['temp_min'],weather['humidity'],weather['windspeed'], weather['pressure'],weather['timestamp'],weather['latitude'],int(weather['elevation']))
	print dailyevapotranspiration
	print weather['rain']
	#waterinsoil=dailyevapotranspiration-(weather['rain']+waterinsoil) #amount of water in soil
	if dailyevapotranspiration>float(weather['rain']):
		shouldwater='Yes'

	schedule[days[int(dayofweek)]]=shouldwater
	return schedule
##################### Time Info #####################
unixtimestamp=int(time.time())
##################### Mongo Client #####################

client = MongoClient() #you can specify a mongo url to mongoclient()
db=client['mySprinkler'] #set to database
weekcollection=db['forecasts'] #set to weeklyforecast collection
dailycollection=db['condweathers'] #set to daily forecast collection
schedule=db['schedules']
wateringschedule =db['wateringschedule']
scheduleid=db.wateringschedule.find_one()["_id"]
printer=pprint.PrettyPrinter(indent=2)

schedule=weeklyschedule(weekcollection,1449079200) #change to unixtimestamp
printer.pprint(schedule)
db.wateringschedule.update({"_id" : scheduleid},schedule)

timestamp="1449095272"
updatedschedule=dailyscheduler(dailycollection,1449095272,schedule) #change to unixtimestamp
printer.pprint(updatedschedule)
db.wateringschedule.update({"_id" : scheduleid},updatedschedule)
