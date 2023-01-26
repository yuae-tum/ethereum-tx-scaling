import glob, os, json
import numpy as np
import pandas as pd
import plotly.graph_objects as go
import plotly.express as plt

data_folder = '/Users/yeyuan/Desktop/Seminar/data'
elapsed_time = 300

def dataAnalysisAndVisualization():
	file_list = loadFiles(data_folder)

	m1_throughput_list = []
	m2_throughput_list = []
	m3_throughput_list = []
	m1_latency_list = []
	m2_latency_list = []
	m3_latency_list = []
	
	for file_name in file_list:
		print(file_name)
		#ramp = int(input("Define ramp period: "))
		#machines = int(input("input number of machines: "))
		#elapsed_time = input("input elapsed time for the test: ")
		machines = 0
		if 'm1' in file_name:
			machines = 1
		if 'm2' in file_name:
			machines = 2
		if 'm3' in file_name:
			machines = 3
		#print('machine num: ')
		#print(machines)
		file = open(file_name)
		data = json.load(file)
		transactions = data['txData']
		blocks = data['miningNodeData']
		result = transactionCalculation(transactions, 30, machines)
		print(result)
		if machines == 1:
			m1_throughput_list.append(result[0])
			m1_latency_list.append(result[1])
		if machines == 2:
			#continue
			m2_throughput_list.append([result[0], result[2], result[4]])
			m2_latency_list.append([result[1], result[3], result[5]])
		if machines == 3:
			#continue
			m3_throughput_list.append([result[0], result[2], result[4], result[6]])
			m3_latency_list.append([result[1], result[3], result[5], result[7]])
	'''
	print('throughput list')
	print(m1_throughput_list)
	print(m2_throughput_list)
	print(m3_throughput_list)
	print('latency list')
	print(m1_latency_list)
	print(m2_latency_list)
	print(m3_latency_list)
	'''
	m1_throughput_fig = generateFig(['a1', 'a2', 'a3', 'a4-100' ,'a4-1000', 'a4-10000'], [m1_throughput_list[0], m1_throughput_list[1], m1_throughput_list[2], m1_throughput_list[5], m1_throughput_list[4], m1_throughput_list[3]], "Throughput m=1")
	m1_throughput_fig.show()
	m2_throughput_fig = generateFig(['a1', 'a2', 'a3', 'a4-100' ,'a4-1000', 'a4-10000'], [m2_throughput_list[0][0], m2_throughput_list[1][0], m2_throughput_list[2][0], m2_throughput_list[5][0], m2_throughput_list[4][0], m2_throughput_list[3][0]], "Throughput m=2")
	m2_throughput_fig.show()
	m2_per_machine_throughput_fig = generatePerMachineFig(['a1', 'a2', 'a3', 'a4-100', 'a4-1000', 'a4-10000'], ['m1', 'm2'], [[m2_throughput_list[0][1], m2_throughput_list[0][2]], [m2_throughput_list[1][1], m2_throughput_list[1][2]], [m2_throughput_list[2][1], m2_throughput_list[2][2]], [m2_throughput_list[5][1], m2_throughput_list[5][2]], [m2_throughput_list[4][1], m2_throughput_list[4][2]], [m2_throughput_list[3][1], m2_throughput_list[3][2]]], "Throughput per machine m=2")
	m2_per_machine_throughput_fig.show()
	m3_throughput_fig = generateFig(['a1', 'a2', 'a3', 'a4-100' ,'a4-1000', 'a4-10000'], [m3_throughput_list[0][0], m3_throughput_list[1][0], m3_throughput_list[2][0], m3_throughput_list[5][0], m3_throughput_list[4][0], m3_throughput_list[3][0]], "Throughput m=3")
	m3_throughput_fig.show()
	m3_per_machine_throughput_fig = generatePerMachineFig(['a1', 'a2', 'a3', 'a4-100', 'a4-1000', 'a4-10000'], ['m1', 'm2', 'm3'], [[m3_throughput_list[0][1], m3_throughput_list[0][2], m3_throughput_list[0][3]], [m3_throughput_list[1][1], m3_throughput_list[1][2], m3_throughput_list[1][3]], [m3_throughput_list[2][1], m3_throughput_list[2][2], m3_throughput_list[2][3]], [m3_throughput_list[5][1], m3_throughput_list[5][2], m3_throughput_list[5][3]], [m3_throughput_list[4][1], m3_throughput_list[4][2], m3_throughput_list[4][3]], [m3_throughput_list[3][1], m3_throughput_list[3][2], m3_throughput_list[3][3]]], "Throughput per machine m=3")
	m3_per_machine_throughput_fig.show()

	m1_latency_fig = generateFig(['a1', 'a2', 'a3', 'a4-100' ,'a4-1000', 'a4-10000'], [m1_latency_list[0], m1_latency_list[1], m1_latency_list[2], m1_latency_list[5], m1_latency_list[4], m1_latency_list[3]], "Latency m=1")
	m1_latency_fig.show()
	m2_latency_fig = generateFig(['a1', 'a2', 'a3', 'a4-100' ,'a4-1000', 'a4-10000'], [m2_latency_list[0][0], m2_latency_list[1][0], m2_latency_list[2][0], m2_latency_list[5][0], m2_latency_list[4][0], m2_latency_list[3][0]], "Latency m=2")
	m2_latency_fig.show()
	m2_per_machine_latency_fig = generatePerMachineFig(['a1', 'a2', 'a3', 'a4-100', 'a4-1000', 'a4-10000'], ['m1', 'm2'], [[m2_latency_list[0][1], m2_latency_list[0][2]], [m2_latency_list[1][1], m2_latency_list[1][2]], [m2_latency_list[2][1], m2_latency_list[2][2]], [m2_latency_list[5][1], m2_latency_list[5][2]], [m2_latency_list[4][1], m2_latency_list[4][2]], [m2_latency_list[3][1], m2_latency_list[3][2]]], "latency per machine m=2")
	m2_per_machine_latency_fig.show()
	m2_latency_fig = generateFig(['a1', 'a2', 'a3', 'a4-100' ,'a4-1000', 'a4-10000'], [m3_latency_list[0][0], m3_latency_list[1][0], m3_latency_list[2][0], m3_latency_list[5][0], m3_latency_list[4][0], m3_latency_list[3][0]], "Latency m=3")
	m2_latency_fig.show()
	m3_per_machine_latency_fig = generatePerMachineFig(['a1', 'a2', 'a3', 'a4-100', 'a4-1000', 'a4-10000'], ['m1', 'm2', 'm3'], [[m3_latency_list[0][1], m3_latency_list[0][2], m3_latency_list[0][3]], [m3_latency_list[1][1], m3_latency_list[1][2], m3_latency_list[1][3]], [m3_latency_list[2][1], m3_latency_list[2][2], m3_latency_list[2][3]], [m3_latency_list[5][1], m3_latency_list[5][2], m3_latency_list[5][3]], [m3_latency_list[4][1], m3_latency_list[4][2], m3_latency_list[4][3]], [m3_latency_list[3][1], m3_latency_list[3][2], m3_latency_list[3][3]]], "latency per machine m=3")
	m3_per_machine_latency_fig.show()

def loadFiles(folder): 
	file_list = []
	files = os.listdir(folder)
	#print(files)
	files.sort()
	#print("after sort")
	#print(files)
	for file in files:
		if file.endswith(".json"):
			file_list.append(os.path.join(folder, file))
	return file_list
	
def transactionCalculation(transactions, ramp, machines):
	#transactions.sort(key = lambda transactions: transactions['created'], reverse=True)
	start_time = transactions[0]['created']
	end_time = transactions[-1]['created']
	start_time_after_ramp = start_time + ramp * 1000
	end_time_after_ramp = end_time + ramp * 1000
	'''
	valid_transactions = []
	for tx in transactions:
		print(tx)
		if tx['created'] >= start_time_after_ramp or tx['created'] <= end_time_after_ramp:
			valid_transactions.append(tx)
		
		if 'created' in tx:
			break
		else:
			print('key not found')
	'''	
	valid_transactions = [tx for tx in transactions if 'created' in tx and (tx['created'] >= start_time_after_ramp or tx['created'] <= end_time_after_ramp)]
	#print("valid tx: ")
	#print(len(valid_transactions))
	machine1_transactions = []
	machine2_transactions = []
	machine3_transactions = []

	total_throughput = 0
	m1_throuput = 0
	m2_throuput = 0
	m3_throuput = 0

	total_mean_latency = 0
	m1_latency = 0
	m2_latency = 0
	m3_latency = 0

	machine1_transactions = []
	machine2_transactions = []
	machine3_transactions = []
	'''
	print(transactions[0]['machineId'][23])
	print("tx-scaling_tx-creation.2" in transactions[0]['machineId'])
	
	for tx in transactions:
		print(tx)
		#if machines == 1:
		if "tx-scaling_tx-creation.2" in tx['machineId']:
			machine2_transactions.append(tx)
	'''		
	
	try:
		machine1_transactions = [tx for tx in transactions if ('machineId' in tx and "tx-scaling_tx-creation.1" in tx['machineId'])]
		#print("m1 tx: ")
		#print(len(machine1_transactions))
	except:
		print("not using machine id 1")
	try:
		machine2_transactions = [tx for tx in transactions if ('machineId' in tx and "tx-scaling_tx-creation.2" in tx['machineId'])]
		#print("m2 tx: ")
		#print(len(machine2_transactions))
	except:
		print("not using machine id 2")
	try:
		machine3_transactions = [tx for tx in transactions if ('machineId' in tx and "tx-scaling_tx-creation.3" in tx['machineId'])]
		#print("m3 tx: ")
		#print(len(machine3_transactions))
	except:
		print("not using machine id 3")
	
	total_throughput = calculateThroughput(valid_transactions, ramp)
	total_mean_latency = calculateLatency(valid_transactions)
	#print("t throughtput")
	#print(total_throughput)
	if machines > 1:
		if len(machine1_transactions) > 0:
			m1_throuput = calculateThroughput(machine1_transactions, ramp)
		if len(machine2_transactions) > 0:
			m2_throuput = calculateThroughput(machine2_transactions, ramp)
		if len(machine3_transactions) > 0:
			m3_throuput = calculateThroughput(machine3_transactions, ramp)

		if len(machine1_transactions) > 0:
			m1_latency = calculateLatency(machine1_transactions)
		if len(machine2_transactions) > 0:
			m2_latency = calculateLatency(machine2_transactions)
		if len(machine3_transactions) > 0:
			m3_latency = calculateLatency(machine3_transactions)
	
	if machines == 1:
		return [total_throughput, total_mean_latency]
	if machines == 2:
		if m1_throuput == 0:
			return [total_throughput, total_mean_latency, m2_throuput, m2_latency, m3_throuput, m3_latency]
		if m2_throuput == 0:
			return [total_throughput, total_mean_latency, m1_throuput, m1_latency, m3_throuput, m3_latency]
		if m3_throuput == 0:
			return [total_throughput, total_mean_latency, m1_throuput, m1_latency, m2_throuput, m2_latency]
	if machines == 3:
		return [total_throughput, total_mean_latency, m1_throuput, m1_latency, m2_throuput, m2_latency, m3_throuput, m3_latency]
		
		
def calculateThroughput(transactions, ramp):
	period = elapsed_time - 2 * ramp
	#throughput = len(transactions) / period
	return len(transactions) / period

def calculateLatency(transactions):
	mean_latency = np.mean([tx["waitingTime"] for tx in transactions]) / 1000
	return mean_latency

def generateFig(x_vals, y_vals, title_val):
	fig = plt.bar(
            x = x_vals, 
			y = y_vals,
			text=y_vals, 
			text_auto=True,
			title=title_val
        )
	return fig

def generatePerMachineFig(x_vals, machine_vals, y_vals, title_val):
	#print(y_vals)
	
	if len(machine_vals) == 2:
		m1 = [y_vals[0][0], y_vals[1][0], y_vals[2][0], y_vals[3][0], y_vals[4][0], y_vals[5][0]]
		m2 = [y_vals[0][1], y_vals[1][1], y_vals[2][1], y_vals[3][1], y_vals[4][1], y_vals[5][1]]
		fig = go.Figure(data=[
			go.Bar(
				name=machine_vals[0],
				x=x_vals,
				y=m1,
				text=m1
			),
			go.Bar(
				name=machine_vals[1],
				x=x_vals,
				y=m2,
				text=m2
			)
		])
	if len(machine_vals) == 3:
		m1 = [y_vals[0][0], y_vals[1][0], y_vals[2][0], y_vals[3][0], y_vals[4][0], y_vals[5][0]]
		m2 = [y_vals[0][1], y_vals[1][1], y_vals[2][1], y_vals[3][1], y_vals[4][1], y_vals[5][1]]
		m3 = [y_vals[0][2], y_vals[1][2], y_vals[2][2], y_vals[3][2], y_vals[4][2], y_vals[5][2]]
		fig = go.Figure(data=[
			go.Bar(
				name=machine_vals[0],
				x=x_vals,
				y=m1,
				text=m1
			),
			go.Bar(
				name=machine_vals[1],
				x=x_vals,
				y=m2,
				text=m2
			),
			go.Bar(
				name=machine_vals[2],
				x=x_vals,
				y=m3,
				text=m3
			)
		])
	
	return fig

if __name__ == '__main__':
    dataAnalysisAndVisualization()
