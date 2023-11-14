from scenedetect import video_splitter
from scenedetect import VideoManager
from scenedetect import SceneManager
import json
from moviepy.editor import *
import subprocess
import glob
import os
import shutil
import logging
# import json
# import sys

# ffmpeg version 4.2.7, python version 3.8.10
# Requires folder files_to_compress where videos you want to compress should be in format DesiredVmaf_filename.mp4 (for example 60_avatar.mp4). Output video will be saved in the folder created_files, together with json with calculated vmaf per scene and source video.

# Content-aware scene detection:
from scenedetect.detectors import ContentDetector


# Find scenes
def find_scenes(video_path, threshold=30.0):
    # Create our video & scene managers, then add the detector.
    video_manager = VideoManager([video_path])
    scene_manager = SceneManager()
    scene_manager.add_detector(
        ContentDetector(threshold=threshold))

    # Improve processing speed by downscaling before processing.
    video_manager.set_downscale_factor(downscale_factor=1)

    # Start the video manager and perform the scene detection.
    video_manager.start()
    scene_manager.detect_scenes(frame_source=video_manager)

    # Each returned scene is a tuple of the (start, end) timecode.
    return scene_manager.get_scene_list()


# Function to compress the video using CRF value and scaling
def compress_crf(conv_video, ref_video, crf_value, scale):
    p = subprocess.Popen(['ffmpeg', '-y', '-i', ref_video, '-vf', scale, '-sws_flags', 'bilinear', 'down.mp4'])
    p.wait()
    p = subprocess.Popen(['ffmpeg', '-y', '-i', 'down.mp4', '-c:v', 'libx264', '-preset', 'fast', '-crf', crf_value,
                          '-c:a', 'copy', 'crf.mp4'])
    p.wait()
    p = subprocess.Popen(['ffmpeg', '-y', '-i', 'crf.mp4', '-vf', 'scale=1920x1080', '-sws_flags', 'bilinear',
                          conv_video])
    p.wait()
    return 0


# Function to write data to a JSON file
def write_json(new_data, filename):
    with open(filename, 'r+') as file:
        # First we load existing data into a dict.
        file_data = json.load(file)
        # Join new_data with file_data
        file_data["content"].append(new_data)
        # Sets file's current position at offset.
        file.seek(0)
        # convert back to json.
        json.dump(file_data, file, indent=4)


# Your input directory and output directory
my_input_dir = "files_to_compress"
my_output_dir = "created_files"
path_parent = os.getcwd()
print(path_parent)
working_dir = "{}/{}".format(path_parent, my_input_dir)
results_dir = "{}/{}".format(path_parent, my_output_dir)

os.chdir(working_dir)
# Loop through video files in the input directory
for file in glob.glob("*.mp4"):
    print(f'file = {file}')
    my_vmaf = int(file[0:2])
    if my_vmaf == 99:
        my_vmaf = 100
    input_name = file[3:len(file) - 4]
    video_names = '{}_$SCENE_NUMBER.mp4'.format(input_name)
    full_video_y4m = "{}.yuv".format(input_name)
    txt_file_pth = "{}_{}.txt".format(input_name, my_vmaf)
    json_file_pth = "{}_{}.json".format(input_name, my_vmaf)
    output_name = '{}_vmaf{}.mp4'.format(input_name, my_vmaf)
    input_video_pth = [file]
    resolution = []
    # Define which crf and resolution levels should be used for which desired vmaf
    with open(json_file_pth, 'w') as f:
        jsondata = {'file_name': output_name, 'vmaf': my_vmaf, 'content': []}
        json.dump(jsondata, f, indent=4)
    if my_vmaf == 100:
        list_crf = [16]
        resolution.append('scale=1920x1080')
    elif my_vmaf == 80:
        list_crf = [16, 20, 24, 26, 28, 30, 32, 35]
        resolution.append('scale=1280x720')
        resolution.append('scale=854x480')
    elif my_vmaf == 60:
        list_crf = [16, 20, 24, 26, 28, 30, 32, 35]
        resolution.append('scale=1280x720')
        resolution.append('scale=854x480')
        resolution.append('scale=640x360')
    elif my_vmaf == 40:
        list_crf = [16, 20, 24, 26, 28, 30, 32, 35]
        resolution.append('scale=854x480')
        resolution.append('scale=640x360')
        resolution.append('scale=426x240')
    elif my_vmaf == 20:
        list_crf = [16, 20, 24, 26, 28, 30, 32, 35]
        resolution.append('scale=426x240')

    scenes = find_scenes(file)
    video_splitter.split_video_ffmpeg(input_video_pth, scenes, video_names, input_name,
                                      arg_override='-c:v libx264 -preset fast -crf 0 -c:a aac',
                                      hide_progress=False, suppress_output=False)
    dict_crf_to_scene_vmaf = {}
    dict_files_names = {}
    dict_crfs = {}
    dict_resolutions = {}
    # loop through resolutions and CRFs to compress each scene
    for r in range(len(resolution)):
        for q in range(len(list_crf)):
            full_video_compressed = "{}_crf{}_{}.mp4".format(input_name, list_crf[q], resolution[r])
            compress_crf(full_video_compressed, file, str(list_crf[q]), resolution[r])
            input_name_c = '{}_crf{}_{}'.format(input_name, list_crf[q], resolution[r])
            video_names_c = '{}_$SCENE_NUMBER.mp4'.format(input_name_c)
            input_video_pth2 = [full_video_compressed]
            video_splitter.split_video_ffmpeg(input_video_pth2, scenes, video_names_c, input_name_c, arg_override='-c:v libx264 -preset fast -crf 0 -c:a aac', hide_progress=False, suppress_output=False)
            dict_crf_to_scene_vmaf[r, q] = []
            dict_files_names[r, q] = []
            dict_crfs[r, q] = []
            dict_resolutions[r, q] = []
            scene_n = 1
            for i in range(len(scenes)):
                if i < 9:
                    current_scene = '{}_00{}.mp4'.format(input_name, scene_n)
                    current_scene_c = '{}_00{}.mp4'.format(input_name_c, scene_n)
                    current_scene_y4m = '{}_00{}.yuv'.format(input_name, scene_n)
                    current_scene_c_y4m = '{}_00{}.yuv'.format(input_name_c, scene_n)
                elif i < 99:
                    current_scene = '{}_0{}.mp4'.format(input_name, scene_n)
                    current_scene_c = '{}_0{}.mp4'.format(input_name_c, scene_n)
                    current_scene_y4m = '{}_0{}.yuv'.format(input_name, scene_n)
                    current_scene_c_y4m = '{}_0{}.yuv'.format(input_name_c, scene_n)
                else:
                    current_scene = '{}_{}.mp4'.format(input_name, scene_n)
                    current_scene_c = '{}_{}.mp4'.format(input_name_c, scene_n)
                    current_scene_y4m = '{}_{}.yuv'.format(input_name, scene_n)
                    current_scene_c_y4m = '{}_{}.yuv'.format(input_name_c, scene_n)

                p = subprocess.Popen(
                    ['ffmpeg', '-y', '-i', current_scene, '-pix_fmt', 'yuv420p', '-vsync', '1', current_scene_y4m])
                p.wait()
                p = subprocess.Popen(
                    ['ffmpeg', '-y', '-i', current_scene_c, '-pix_fmt', 'yuv420p', '-vsync', '1', current_scene_c_y4m])
                p.wait()
                current_scene_path = "{}/{}".format(working_dir, current_scene_y4m)
                current_scene_c_path = "{}/{}".format(working_dir, current_scene_c_y4m)
                # calculate vmaf for each scene
                command = "/your/path/to/vmaf/libvmaf/build/tools/vmafossexec yuv420p 1920 1080 {} {} " \
                          "/your/path/to/vmaf/model/vmaf_v0.6.1.json --log-fmt json --log myvmaf.json --thread 20 " \
                          "--phone-model".format(current_scene_path, current_scene_c_path)
                os.system(command)
                with open('myvmaf.json') as f:
                    vmaf_for_scene = json.load(f)['pooled_metrics']['vmaf']['mean']

                dict_crf_to_scene_vmaf[r, q].append(vmaf_for_scene)
                dict_files_names[r, q].append(current_scene_c)
                dict_crfs[r, q].append(list_crf[q])
                dict_resolutions[r, q].append(resolution[r])
                scene_n += 1
                # delete y4m files, so they don't take up too much space
                p = subprocess.Popen(['rm', current_scene_y4m])
                p.wait()
                p = subprocess.Popen(['rm', current_scene_c_y4m])
                p.wait()
            print(dict_crf_to_scene_vmaf)
            print(dict_files_names)

    list_clips = []
    min_scene_vmafs = []
    jsondata = {}
    file_name = {}
    file_vmaf = {}
    content = {}
# pick scenes which are closest to desired vmaf
    for scene_number in range(len(scenes)):
        sc = scene_number + 1
        scene_vmafs = []
        scene_names = []
        scene_crfs = []
        scene_res = []
        for qp, qp_scene_vmafs in dict_crf_to_scene_vmaf.items():
            scene_vmafs.append(qp_scene_vmafs[scene_number])
        for name, name_scenes in dict_files_names.items():
            scene_names.append(name_scenes[scene_number])
        for res, res_scenes in dict_resolutions.items():
            scene_res.append(res_scenes[scene_number])
        for crf, crf_scenes in dict_crfs.items():
            scene_crfs.append(crf_scenes[scene_number])
        calculated_min = min(range(len(scene_vmafs)), key=lambda index: abs(scene_vmafs[index] - my_vmaf))
        min_scene_vmafs.append(calculated_min)
        picked_vmaf = scene_vmafs[calculated_min]
        picked_scene = scene_names[calculated_min]
        picked_crf = scene_crfs[calculated_min]
        picked_res = scene_res[calculated_min]
        
        y = {"scene_number": sc,
             "calculated_vmaf": picked_vmaf,
             "resolution": picked_res[6:len(str(picked_res))],
             "crf": picked_crf}
        write_json(y, json_file_pth)

        clip = VideoFileClip(picked_scene)
        duration = clip.duration
        clip_n = "clip{}".format(scene_number)
        clip_n = clip.subclip(0, duration)
        list_clips.append(clip_n)
# concatenate the scenes into final, compressed video
    final = concatenate_videoclips(list_clips)
    try:
        final.write_videofile(output_name, threads=6, logger=None)
        logging.info("Saved .mp4 without Exception at {}".format(output_name))
    except IndexError:
        print("saved, with exception")
        pass
    except Exception as e:
        logging.warning("Exception {} was raised!!".format(e))
        print("not saved")
    new_name = "vmaf{}_{}.mp4".format(file[0:2], file[3:len(file) - 4])
    p = subprocess.Popen(
        ['ffmpeg', '-y', '-i', output_name, '-vcodec', 'libx264', '-acodec', 'aac', '-vf', 'scale=1920x1080',
         '-sws_flags',
         'bilinear', new_name])
    p.wait()
    input_file = "{}/{}/{}".format(path_parent, my_input_dir, file)
    output_file = "{}/{}/{}".format(path_parent, my_input_dir, new_name)
    json_file = "{}/{}/{}".format(path_parent, my_input_dir, json_file_pth)
    files_to_copy = [input_file, json_file, output_file]
    for f in files_to_copy:
        shutil.copy(f, results_dir)

# remove files from files_to_compress

for file in os.scandir(working_dir):
    os.remove(file.path)
