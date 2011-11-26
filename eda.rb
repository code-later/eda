require 'sinatra'

get "/*" do
  body File.read("views/index.html")
end
