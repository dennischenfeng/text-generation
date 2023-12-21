# text-generation
:point_right: [Link to web app](http://text-generation-single.eba-bcruagwp.us-east-2.elasticbeanstalk.com/)

A web app that uses a fine-tuned GPT2 model to autocomplete your machine learning abstracts (i.e. paragraph summaries at the beginning of academic papers). 
The stack is as follows:
- React for front end
- Flask for backend server
- Hugging Face's open source DistilGPT2 model as the base language model
- AWS Elastic Beanstalk for distributed cloud deployment; runs on AWS EC2 instance
- 