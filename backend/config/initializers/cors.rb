Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins(
      "http://localhost:5173",
      "https://salary-management-two-chi.vercel.app"
    )

    resource "*",
      headers: :any,
      methods: %i[get post put patch delete options head]
  end
end