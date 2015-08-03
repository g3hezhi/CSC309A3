from locust import HttpLocust, TaskSet, task

class UserBehavior(TaskSet):
    def on_start(self):
        """ on_start is called when a Locust start before any task is scheduled """
        self.login()

    def login(self):
        self.client.post("/login", {"username":"g3hezhi", "password":"123456","email":"hezhiweitian@gmail.com"})
       

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
    def post(self):
        self.client.get("/posting")
    
    @task
    def userinfo_edit(self):
        self.client.get("/userinfo_edit")
    
    @task
    def accountinfo_edit(self):
        self.client.get("/account_edit")
    @task
    def user_inbox(self):
        self.client.get("/user_inbox") 
    @task
    def user_send(self):
        self.client.get("/user_send")     
    
    
        

class WebsiteUser(HttpLocust):
    task_set = UserBehavior
    min_wait=5000
    max_wait=9000