from locust import HttpLocust, TaskSet, task

class UserBehavior(TaskSet):
    def on_start(self):
        """ on_start is called when a Locust start before any task is scheduled """
        self.login()

    def login(self):
        self.client.post("/login", {"username":"g3hezhi", "password":"123456","email":"hezhiweitian@gmail.com"})
    
    def post(self):
        self.client.post("/posting",{"item":"PC", "topic":"test","price":"50","comment":"my test post"})
    
    def userinfo_edit(self):
        self.client.post("/userinfo_edit",{"surname":"he","fname":"zhiwei"})    

    @task(2)
    def index(self):
        self.client.get("/")

    @task(1)
    def profile(self):
        self.client.get("/profile")
        
    @task    
    def contact(self):
        self.client.get("/contact")
    
    @task
    def about(self):
        self.client.get("/about")
    
    @task
    def register(self):
        self.client.get("/register")
    
    @task
    def index(self):
        self.client.get("/index")
    
    
        

class WebsiteUser(HttpLocust):
    task_set = UserBehavior
    min_wait=5000
    max_wait=9000