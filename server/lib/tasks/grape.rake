namespace :grape do
  task routes: :environment do
    Grape::API.subclasses.each do |subclass|
      subclass.routes.each do |e|
        puts format(
          "%<klass>-10s %<method>-6s %<path>-24s %<desc>s",
          klass: subclass,
          method: e.request_method,
          path: e.path,
          desc: e.description
        )
      end
      puts
    end
  end
end
