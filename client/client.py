# import requests so we can connect to the API
import requests

# import keyboard so we can pause the client until the space bar is pressed 
import keyboard

# dict where the user inputs will be stored and sent to the API
message = {"start":"", "finish":""}
# boolean for the 'while' loop so we can stop the client gracefully
running = True
# boolean used to record the validity of the starting point of the user
validStart = False
# boolean used to record the validity of the destination of the user
validEnd = False
        
'''
    This function takes the user input from the menu and returns it's equivalent
value or it changes the boolean 'running' to false  which in turn stops the 
while loop and ends the program
'''
def response(destinationCity) -> str:
    global running
    
    match destinationCity:
        case "1":
            return "New York"     
        
        case "2":
            return "Los Angeles"
        
        case "3":
            return "Chicago"
        
        case "4":
            return "Houston"
        
        case "5":
            return "Pheonix"
        
        case "6":
            return "Philadelphia"
        
        case "7":
            running = False
        
        case _:
            print("Limit yourself to the options on screen!")

'''
    This method makes a get request to the API with the global variable message 
as the parameter, once the API returns the route it is separated in 2 variables
path - the cities the user has to go trough
cost - the total cost of the route
    It also checks if the weight is higher than 0, at which point if it is it 
changes the message["start"] (the starcing city of the route) to the following 
city in the route and prints the path.
    if the cost is 0 that meant the user got to it's destination.
'''
def getServerResponse(message) :
    route = requests.post("http://localhost:3000/",params = message) 
    
# extracting path and cost from API's response and storing them for further use
    path = route.json()['path']
    cost = route.json()['cost'] 
   
    
    if cost > 0 :
        print(path)
        message["start"] = path[1]
    else:
        print("You got to your destination!")
   
'''
    This method is the menu of the client, it prints a menu and awaits a user
input based on the options, it checks if the input is valid, once the input is 
verified it stores it in the message dictionary.
    Once both of the inputs have been inserted the client calls the function
'getServerResponse' and sends it the message dictionary.
    The 'while True loop' stops only if the user is at it's destination or the 
user chooses the option to exit the program.
'''
def menu():
    # global variables that are used throughout the method
    global running
    global validStart
    global validEnd
    
    print("\nWelcome to HALL GPS please follow the instructions below.")

    startingCity = input("\nFrom the following please choose a starting city (only numbers):\n 1) New York\n 2) Los Angeles\n 3) Chicago\n 4) Houston\n 5) Pheonix\n 6) Philadelphia\n 7) Exit program!\n")
    
    if startingCity.isdigit():
        validStart = True
        message["start"] = response(startingCity)

    if validStart:
        while(running):
            destinationCity = input("\nFrom the following please choose a destination (only numbers):\n 1) New York\n 2) Los Angeles\n 3) Chicago\n 4) Houston\n 5) Pheonix\n 6) Philadelphia\n 7) Exit program!\n")

            if destinationCity.isdigit() and destinationCity != "7": 
                message["finish"] = response(destinationCity)
                validEnd = True
            
            elif destinationCity == ("7"):
                running=False
            
            else:
                print("Please limit yourself to the options on screen!")
            
            if message["start"] == message["finish"]:
                running = False
                
            if validEnd:
                validEnd = False
    
                getServerResponse(message)
                print("\nPress the spacebar to continue!\n")
                keyboard.wait('spacebar')

menu()