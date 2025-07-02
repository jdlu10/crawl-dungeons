class Api::V1::CampaignsController < ApplicationController
  def index
    campaigns = Campaign.all
    render json: campaigns
  end

  def show
    campaign = Campaign.find(params[:id])
    render json: campaign
  end

  private

#   def campaign_params
#     params.require(:campaign).permit(:name, :email)
#   end
end