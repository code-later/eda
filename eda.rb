require 'sinatra'
require 'json'

ISSUES = {
  1 => {
    id: 1,
    subject: "Server Down??",
    description: "they make one show. That show's called a pilot.",
    reporter: "Sebastian Cohnen",
    created_at: "21.11.2011 12:26"
  },
  2 => {
    id: 2,
    subject: "Geht nicht",
    description: "they make one show. That show's called a pilot.",
    reporter: "Sebastian Cohnen",
    created_at: "21.11.2011 23:12"
  }
}

get "/issues/:id" do
  headers "Content-Type" => "application/json"
  body ISSUES[params[:id].to_i].to_json
end

get "/issues" do
  headers "Content-Type" => "application/json"
  body ISSUES.values.to_json
end

get "/*" do
  body File.read("views/index.html")
end
