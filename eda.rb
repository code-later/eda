require 'sinatra'
require 'json'

get "/*" do
  body File.read("views/index.html")
end
