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
	weather=dbcollection.find_one({"list.0.dt": dt}) #take out cnt after finalizing database schema

	weeklyforecast=weather['list']
	days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday', 'Saturday']
	week=dict.fromkeys(days)
	schedule=dict.fromkeys(days, 'No')
	properties=['dt', 'humidity', 'speed', 'tempmax', 'tempmin', 'rain', 'pressure', 'lat', 'elevation']

	##################### extracting info #####################
	# need to get pressure elevation and lat data
	#adjust for new input
	for day in week:
		week[day]={'dt': None, 'humidity': None, 'speed': None, 'tempmax': None,'tempmin': None, 'rain': None, 'pressure': None, 'lat': None, 'elevation': None}
	for weatherday,day in enumerate(days):
		for info in properties:
			if info in weeklyforecast[weatherday].keys():
				week[day][info]=weeklyforecast[weatherday][info]
			else:
				week[day][info]=0

	printer.pprint(week)
	##################### Algorithm #####################
	#waterinsoil=0 #fix this so it only sets to 0 on first use
	#threshold=1.0 #adjust to whatever we decide threshold
	for day in week: #for each day of the week find the evapotranspiration
		dailyevapotranspiration=Penman_Monteith(week[day]['tempmax'], week[day]['tempmin'],week[day]['humidity'],week[day]['speed'], week[day]['pressure'],week[day]['dt'],week[day]['lat'],week[day]['elevation'])#need pressure, lat and elevation
		#waterinsoil=dailyevapotranspiration-(week[day]['rain']+waterinsoil) #amount of water in soil
		if dailyevapotranspiration<week[day]['rain']:
			schedule[day]='Yes'

	return schedule

def dailyscheduler(dbcollection, dt, weeklyschedule):
	dayofweek=str(datetime.utcfromtimestamp(dt).weekday())
	weather=collection.find_one({"timestamp": dt}) #fix this after finalizing database
	shouldwater='No'

	dailyevapotranspiration=Penman_Monteith(weather['tempmax'], weather['tempmin'],weather['humidity'],weather['speed'], weather['pressure'],weather['dt'],weather['lat'],weather['elevation'])
	#waterinsoil=dailyevapotranspiration-(weather['rain']+waterinsoil) #amount of water in soil
	if dailyevapotranspiration<week[day]['rain']:
		shouldwater='Yes'

	weeklyschedule[dayofweek]=shouldwater
	return weeklyschedule
##################### Time Info #####################
unixtimestamp=int(time.time())
##################### Mongo Client #####################

client = MongoClient() #you can specify a mongo url to mongoclient()
db=client['testweather'] #set to database
weekcollection=db['rainweek'] #set to weeklyforecast collection
#dailycollection=db['condweathers'] #set to daily forecast collection
schedule=db['schedule']
scheduleid=db.schedule.find_one()["_id"]
printer=pprint.PrettyPrinter(indent=2)

schedule=weeklyschedule(weekcollection,1445709600) #change to unixtimestamp

db.schedule.update({"_id" : scheduleid},schedule)

#updatedschedule=dailyscheduler(dailycollection,1447702807039,schedule) #change to unixtimestamp

#db.schedule.update({"_id" : scheduleid},updatedschedule)
