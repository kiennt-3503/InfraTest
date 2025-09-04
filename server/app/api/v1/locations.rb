module V1
  class Locations < V1::Base
    helpers V1::Base.helpers

    resource :locations do
      desc 'Get all regions'
      get :regions do
        Region.select(:id, :region_name)
      end

      desc 'Get prefectures by region ID'
      params do
        requires :region_id, type: Integer, desc: 'Region ID'
      end
      get :prefectures do
        find_and_render(Region, params[:region_id], :prefectures, [:id, :prefecture_name])
      end

      desc 'Get sections by prefecture ID'
      params do
        requires :prefecture_id, type: Integer, desc: 'Prefecture ID'
      end
      get :sections do
        find_and_render(Prefecture, params[:prefecture_id], :sections, [:id, :section_name])
      end

      desc 'Get districts by section ID'
      params do
        requires :section_id, type: Integer, desc: 'Section ID'
      end
      get :districts do
        find_and_render(Section, params[:section_id], :districts, [:id, :district_name])
      end

      desc 'Get towns by district ID'
      params do
        requires :district_id, type: Integer, desc: 'District ID'
      end
      get :towns do
        find_and_render(District, params[:district_id], :towns, [:id, :town_name])
      end

      desc 'Get stations by prefecture ID'
      params do
        requires :prefecture_id, type: Integer, desc: 'Prefecture ID'
      end
      get :stations do
        find_and_render(Prefecture, params[:prefecture_id], :stations, [:id, :station_name])
      end
    end

    helpers do
      def find_and_render(model_class, id, association, columns)
        record = model_class.find(id)
        record.send(association).select(*columns)
      rescue ActiveRecord::RecordNotFound
        error!({ message: I18n.t('shared.messages.get_data_failed') }, 404)
      end
    end
  end
end
