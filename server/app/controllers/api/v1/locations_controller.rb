class Api::V1::LocationsController < ApplicationController
  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found

  def regions
    render json: Region.select(:id, :region_name)
  end

  def prefectures
    render_json_for(Region, params[:region_id], :prefectures, [:id, :prefecture_name])
  end

  def sections
    render_json_for(Prefecture, params[:prefecture_id], :sections, [:id, :section_name])
  end

  def districts
    render_json_for(Section, params[:section_id], :districts, [:id, :district_name])
  end

  def towns
    render_json_for(District, params[:district_id], :towns, [:id, :town_name])
  end

  private

  def render_json_for(model_class, id, association, columns)
    record = model_class.find(id)
    render json: record.send(association).select(*columns).as_json
  end

  def record_not_found
    render json: { message: I18n.t("shared.messages.get_data_failed") }, status: :not_found
  end
end
