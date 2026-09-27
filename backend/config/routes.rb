Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      get "dashboard", to: "dashboard#index"

      resources :employees do
        resources :salaries
      end
    end
  end
end